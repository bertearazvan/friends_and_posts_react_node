const router = require('express').Router();

const Friend = require('../models/Friend');
const User = require('../models/User');
const Friendship_status = require('../models/Friendship_status');

// Get all my friends
router.get('/friends/', async (req, res) => {
  //get id from url
  if (!req.session.user) {
    return res.status(401).send({
      message: 'You cant access this endpoint without being authenticated',
    });
  }
  const userId = req.session.user.id;
  // console.log(userId);
  //check if it's not a number
  if (!isNaN(userId)) {
    try {
      //check if the user exists
      const existingUser = await User.query().select().where({
        id: userId,
      });

      if (existingUser[0]) {
        //if the user exists, then return the friends
        let friends = await User.query()
          .select(
            'users.id',
            'users.username',
            'users.first_name',
            'users.last_name'
          )
          .join('friends', function () {
            this.on({ 'friends.user_1_id': 'users.id' }).orOn({
              'friends.user_2_id': 'users.id',
            });
          })
          // .where('users.id', '<>', userId)
          .where({ user_1_id: userId, status: 1 })
          .orWhere({ user_2_id: userId, status: 1 });

        let filteredFriends = friends.filter((friend) => friend.id != userId);
        // console.log(filteredFriends);
        return res.status(200).send(filteredFriends);
      } else {
        return res.status(404).send({ message: 'User does not exist' });
      }
    } catch (err) {
      if (err) {
        console.log(err);
      }
      return res.status(500).send('Something went wrong');
    }
  } else {
    return res.status(400).send({
      message: 'Incorrect value',
    });
  }
});

// Get pending friendship requests
router.get('/friends/pending', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send({
      message: 'You cant access this endpoint without being authenticated',
    });
  }
  const userId = req.session.user.id;

  try {
    //check if the user exists
    const existingUser = await User.query()
      .select()
      .where({
        id: userId,
      })
      .limit(1);

    if (existingUser[0]) {
      //Return the friends that are in status pending
      const friendRequests = await User.query()
        .select(
          'users.id',
          'users.username',
          'users.first_name',
          'users.last_name'
        )
        .join('friends', function () {
          this.on({ 'friends.user_1_id': 'users.id' }).orOn({
            'friends.user_2_id': 'users.id',
          });
        })
        .where('friends.action_user_id', '!=', userId)
        .where({ user_1_id: userId, status: 2 })
        .orWhere({ user_2_id: userId, status: 2 });
      let filteredFriendRequests = friendRequests.filter(
        (friend) => friend.id != userId
      );
      return res.status(200).send(filteredFriendRequests);
    } else {
      return res.status(404).send({ message: 'User does not exist' });
    }
  } catch (err) {
    if (err) {
      console.log(err);
    }
    return res.status(500).send('Something went wrong');
  }
});

router.put('/friends/:statusName/:reqId', async (req, res) => {
  let { statusName, reqId } = req.params;
  

  if (!req.session.user) {
    return res.status(401).send({
      message: 'You cant access this endpoint without being authenticated',
    });
  }

  const id = req.session.user.id;
  const statusId = await Friendship_status.query()
    .select('id')
    .where({ name: statusName });

  if (reqId.length === 0) {
    return res.status(404).send({ message: 'User does not exist' });
  }

  if (isNaN(reqId)) {
    try {
      const user = await User.query().select('id').where({ username: reqId });
      if (user[0]) {
        reqId = user[0].id;
      } else {
        return res.status(404).send({ message: 'User does not exist' });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send('Something went wrong');
    }
  }

  //check if the searched status exists
  // console.log(statusId[0]);
  if (!statusId[0]) {
    return res.status(404).send({
      message: 'Status does not exist',
    });
  }

  if (!id || !reqId || id == reqId) {
    return res.status(400).send({
      message: 'Incorrect value',
    });
  }

  //    status can be accept, pending or reject
  //   verify if the id's are numbers and that they are different

  try {
    const existingUser = await User.query()
      .select()
      .where({
        id: id,
      })
      .orWhere({ id: reqId })
      .limit(2);

    // Check if both of the users exist in the database
    if (existingUser.length === 2) {
      const friendship = await Friend.query()
        .select()
        .where({ user_1_id: reqId, user_2_id: id })
        .orWhere({ user_1_id: id, user_2_id: reqId });

      // Check if the friendship relationship exists
      if (friendship[0]) {
        // Check for adding an existing friend
        if (friendship[0].status === 1 && statusId[0].id === 2) {
          return res.status(400).send({
            message: 'You cant add an existing friend',
          });
        }

        // Check if the user wants to send an accept when being blocked
        if (friendship[0].status === 3 && statusId[0].id === 1) {
          return res.status(400).send({
            message: 'You have to send a friend request first',
          });
        }

        // Check if the request is the same as the existing one
        if (friendship[0].status === statusId[0].id) {
          return res.status(400).send({
            message: 'You cant send the same request again',
          });
        }

        // Check if the status is not 1, because you should not
        // accept the requested friendship from the same user
        if (statusId[0].id !== 1) {
          const affectedRows = await Friend.query()
            .update({
              status: statusId[0].id,
              action_user_id: id,
            })
            .where({ user_1_id: reqId, user_2_id: id })
            .orWhere({
              user_1_id: id,
              user_2_id: reqId,
            });

          return res.status(200).send({
            type: statusName,
            message: 'Success',
            affectedRows: affectedRows,
          });
        } else {
          // if confirm, you can't confirm as a requester
          if (Number(id) === friendship[0].action_user_id) {
            return res.status(400).send({
              message: 'You cant accept the request sent by you',
            });
          }

          const affectedRows = await Friend.query()
            .update({
              status: statusId[0].id,
              action_user_id: id,
            })
            .where({ user_1_id: reqId, user_2_id: id })
            .orWhere({ user_1_id: id, user_2_id: reqId });

          return res.status(200).send({
            type: statusName,
            message: 'The request has been sent',
            affectedRows: affectedRows,
          });
        }
      } else {
        // if the friendship does not exist, we have to create a new one.
        if (statusId[0].id === 1 || statusId[0].id === 3) {
          return res.status(400).send({
            message: 'You cant add an user directly. Send a request first',
          });
        } else {
          await Friend.query().insert({
            user_1_id: id,
            user_2_id: reqId,
            status: 2,
            action_user_id: id,
          });
          return res
            .status(200)
            .send({ type: statusName, message: 'The request has been sent' });
        }
      }
    } else {
      return res.status(404).send({ message: 'User does not exist' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send('Something went wrong');
  }
});

module.exports = router;
