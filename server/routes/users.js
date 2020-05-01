const nodemailer = require('nodemailer');
const router = require('express').Router();
const smtpCredentials = require('../config/smtp_credentials');

const User = require('../models/User');

const bcrypt = require('bcrypt');
const saltRounds = 10;

// bcrypt.hash("password", saltRounds, (error, hashedPassword) => {
//     if (error) {
//         console.log(error);
//     }
//     console.log("this is the newly hashed password", hashedPassword);
// })

// bcrypt.compare("password", "$2b$10$iIWF5cIuNrXrRGw8xqdr7efqYjgpqxc1OJWIM3IhzXSNPhH6.MJ5q", (error, isSame) => {
//     if (error) {
//         console.log(error);
//     }
//     console.log("it is the same? ", isSame);
// })

//CREATE ROUTE FOR TOKEN WITH crypto

router.put('/users/confirmResetPassword', async (req, res) => {
  const { id, password, confirmPassword } = req.body;

  if (!id || !password || !confirmPassword) {
    return res.status(400).send({
      message: 'Missing fields',
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).send({
      message: 'Passwords do not match',
    });
  }

  try {
    const userPassword = await User.query()
      .select('password')
      .where({ id: id });

    // checking if the given password is the same as the previous password
    bcrypt.compare(password, userPassword[0].password, (error, isSame) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .send({ response: 'There was an error when crypting the data' });
      }

      if (isSame) {
        return res
          .status(400)
          .send({ message: 'You can not use the same password' });
      }

      bcrypt.hash(password, saltRounds, async (error, hashedPassword) => {
        if (error) {
          return res
            .status(500)
            .send({ response: 'There was an error when crypting the data' });
        }

        // update the password
        const affectedRows = await User.query()
          .update({
            password: hashedPassword,
            token: null,
          })
          .where({ id: id });

        return res.status(200).send({
          message: 'Your password is successfully reseted!',
          affectedRows: affectedRows,
        });
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Something went wrong');
  }
});

router.post('/users/resetPassword', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).send({
      message: 'Missing fields',
    });
  } else {
    try {
      const users = await User.query()
        .where({
          username: username,
        })
        .limit(1);

      console.log(users);

      if (!users[0]) {
        return res.status(404).send({
          message: 'This user does not exist',
        });
      } else {
        // create a token with b-crypt
        // add token to db

        // create output for the body of the email
        const output = `<!doctype html>
        <html lang="en-US">
        
        <head>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <title>Reset Password Email Template</title>
            <meta name="description" content="Reset Password Email Template.">
            <style type="text/css">
                a:hover {
                    text-decoration: underline !important;
                }
            </style>
        </head>
        
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
            <!--100% body table-->
            <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                <tr>
                    <td>
                        <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                            align="center" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
        
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td>
                                    <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                        style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:0 35px;">
                                                <h1
                                                    style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                                    You have
                                                    requested to reset your password</h1>
                                                <span
                                                    style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                    We cannot simply send you your old password. A unique link to reset your
                                                    password has been generated for you. To reset your password, click the
                                                    following link and follow the instructions.
                                                </p>
                                                <a href="http://localhost:3000/resetForm/${users[0].id}"
                                                    style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                                    Password</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                    </table>
                                </td>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                    <p
                                        style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">
                                        &copy; <strong>www.mrbertea.com</strong></p>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <!--/100% body table-->
        </body>
        
        </html>`;
        let transporter = nodemailer.createTransport(smtpCredentials);

        // verify connection configuration
        transporter.verify((err, success) => {
          if (err) {
            console.log(err);
            res.status(502).send({
              message: 'There has been a problem with the mailing service',
            });
          }
        });

        var mailOptions = {
          from: 'kea.razvan.test@gmail.com',
          to: username,
          subject: 'Nodemailer reset password',
          text: `Reset password email: "http://localhost:3000/resetForm/${users[0].id}"`,
          html: output,
        };

        // try to send email

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log(err);
            res.status(502).send({
              message: 'There has been a problem when sending the mail',
            });
          }

          console.log(info);
          res.status(200).send({
            message: 'Email is sent!',
          });
        });
        // send confirmation message
      }
    } catch (err) {
      console.log(err);
      res.status(400).send({ message: 'Something went wrong' });
    }
  }
});

router.post('/users/login', async (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    try {
      const users = await User.query()
        .where({
          username: username,
        })
        .limit(1);

      const user = users[0];
      console.log(user);
      if (!user) {
        return res.status(404).send({
          message: 'Wrong username',
        });
      }

      bcrypt.compare(password, user.password, (error, isSame) => {
        if (error) {
          return res
            .status(500)
            .send({ response: 'There was an error when crypting the data' });
        }
        //   console.log(isSame);
        user.password = '';
        if (!isSame) {
          return res.status(404).send({
            message: 'Wrong password',
          });
        } else {
          sess = user;

          return res.send({
            response: user,
          });
        }
      });
    } catch (err) {
      res.status(400).send({ message: 'Something went wrong' });
    }
  } else {
    return res.status(400).send({
      message: 'Username or password not defined',
    });
  }
});

router.post('/users/register', (req, res) => {
  const { username, password, firstName, lastName, repeatPassword } = req.body;

  if (
    username &&
    password &&
    firstName &&
    lastName &&
    repeatPassword &&
    password === repeatPassword
  ) {
    if (password.length < 8) {
      return res.status(400).send({
        message: 'Password is too short',
      });
    } else {
      bcrypt.hash(password, saltRounds, async (error, hashedPassword) => {
        if (error) {
          return res
            .status(500)
            .send({ message: 'There was an error when crypting the data' });
        }

        try {
          const existingUser = await User.query()
            .select()
            .where({
              username: username,
            })
            .limit(1);

          if (existingUser[0]) {
            return res.status(404).send({
              message: 'User already exists',
            });
          } else {
            const newUser = await User.query()
              .insert({
                username,
                password: hashedPassword,
                first_name: firstName,
                last_name: lastName,
              })
              .whereNotExists(() => {
                User.query().select().whereNot({
                  username: username,
                });
              });
            return res.status(200).send({
              newUser,
            });
          }
        } catch (err) {
          console.log(err);
          return res.status(500).send('Something went wrong');
        }
      });
    }
  } else {
    return res.status(404).send({
      message: 'Missing fields',
    });
  }
});

module.exports = router;
