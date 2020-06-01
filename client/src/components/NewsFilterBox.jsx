import 'date-fns';
import React, { useState } from 'react';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import DateFnsUtils from '@date-io/date-fns';
import {
  Button,
  Grid,
  Card,
  Typography,
  TextField,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  RadioGroup,
  Select,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  friendsWidth: {
    width: '100%',
    height: '100%',
    // margin: '1rem',
    // position: 'relative',
  },

  formControl: {
    margin: theme.spacing(1),
    marginLeft: 0,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const NewsFilterBox = (props) => {
  const classes = useStyles();
  const [countries] = useState([
    { code: '', name: 'None' },
    { code: 'ro', name: 'Romania' },
    { code: 'au', name: 'Austria' },
    { code: 'bg', name: 'Bulgaria' },
    { code: 'ca', name: 'Canada' },
    { code: 'de', name: 'Germany' },
    { code: 'fr', name: 'French' },
    { code: 'gb', name: 'Great Britain' },
    { code: 'hu', name: 'Hungary' },
    { code: 'no', name: 'Norway' },
    { code: 'pl', name: 'Poland' },
    { code: 'us', name: 'USA' },
  ]);
  const [languages] = useState([
    {
      code: '',
      name: 'None',
    },
    {
      code: 'ar',
      name: 'Arabic',
    },
    {
      code: 'de',
      name: 'Deutsche',
    },
    {
      code: 'en',
      name: 'English',
    },
    {
      code: 'es',
      name: 'Espanol',
    },
    {
      code: 'fr',
      name: 'Franchise',
    },
    {
      code: 'nl',
      name: 'Netherlands',
    },
    {
      code: 'no',
      name: 'Norsk',
    },
    {
      code: 'ru',
      name: 'Russkiy',
    },
    {
      code: 'se',
      name: 'Svenska',
    },
  ]);
  const [categories] = useState([
    'Business',
    'Entertainment',
    'General',
    'Health',
    'Science',
    'Sports',
    'Technology',
  ]);
  const [sortOptions] = useState(['', 'Relevancy', 'Popularity', 'Latest']);
  // set form state
  const [form, setForm] = React.useState({
    countries: '',
    channels: ['cnn'],
    categories: '',
    phrase: '',
    type: 'everything',
    languages: '',
    sort: '',
    fromDate: new Date(),
    toDate: new Date(),
  });

  // set form values
  const handleChange = (prop) => (event) => {
    if (event.target) {
      setForm({ ...form, [prop]: event.target.value });
    } else {
      setForm({ ...form, [prop]: event });
    }
  };

  const onAddFilter = () => {
    props.onAddFilter(form);
  };
  //   const handleChange = (event) => {
  //     setCountries(event.target.value);
  //   };
  // console.log(props.sources);
  return (
    <Grid className={classes.friendsWidth}>
      <Card className={'cardFilter'} variant="outlined">
        <Box>
          <Typography variant="h5" component="h2">
            Filter news
          </Typography>
          <p>You have to select at least one criteria.</p>
          <br />
          <Grid>
            <FormControl component="fieldset">
              <RadioGroup
                row
                name="type"
                defaultValue="top"
                onChange={handleChange('type')}
                value={form.type}
              >
                <FormControlLabel
                  value="headlines"
                  control={<Radio color="primary" />}
                  label="Top headlines"
                />
                <FormControlLabel
                  value="everything"
                  control={<Radio color="primary" />}
                  label="Everything"
                />
              </RadioGroup>
            </FormControl>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Search by a phrase or keywords"
              name="phrase"
              value={form.phrase}
              onChange={handleChange('phrase')}
            />
            <FormControl
              fullWidth
              variant="outlined"
              className={classes.formControl}
            >
              <InputLabel id="demo-simple-select-filled-label">
                News channels
              </InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                name="channels"
                label="News channels"
                value={form.channels}
                onChange={handleChange('channels')}
                // disabled={
                //   form.categories.length > 0 || form.countries.length > 0
                //     ? true
                //     : false
                // }
              >
                <MenuItem key={'channel-0'} value={''}>
                  {'None'}
                </MenuItem>
                {props.sources.map((channel, index) => {
                  return (
                    <MenuItem key={('channel-', index)} value={channel.id}>
                      {channel.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            {form.type === 'headlines' ? (
              <React.Fragment>
                <FormControl
                  fullWidth
                  variant="outlined"
                  className={classes.formControl}
                >
                  <InputLabel id="demo-simple-select-filled-label">
                    Countries
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    name="countries"
                    label="Countries"
                    value={form.countries}
                    onChange={handleChange('countries')}
                    // disabled={form.channels.length > 0 ? true : false}
                  >
                    {countries.map((country, index) => {
                      return (
                        <MenuItem
                          key={('country-', index)}
                          value={country.code}
                        >
                          {country.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <FormControl
                  fullWidth
                  variant="outlined"
                  className={classes.formControl}
                >
                  <InputLabel id="demo-simple-select-filled-label">
                    Categories
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    name="categories"
                    label="Categories"
                    value={form.categories}
                    onChange={handleChange('categories')}
                    // disabled={form.channels.length > 0 ? true : false}
                  >
                    <MenuItem key={'category-0'} value={''}>
                      {'None'}
                    </MenuItem>
                    {categories.map((category, index) => {
                      return (
                        <MenuItem key={('category-', index)} value={category}>
                          {category}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <FormControl
                  fullWidth
                  variant="outlined"
                  className={classes.formControl}
                >
                  <InputLabel id="demo-simple-select-filled-label">
                    Sort by
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    name="sort"
                    label="Sort by"
                    value={form.sort}
                    onChange={handleChange('sort')}
                  >
                    <MenuItem key={'sort-0'} value={''}>
                      {'None'}
                    </MenuItem>
                    {sortOptions.map((option, index) => {
                      return (
                        <MenuItem key={('sort-', index)} value={option}>
                          {option}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl
                  fullWidth
                  variant="outlined"
                  className={classes.formControl}
                >
                  <InputLabel id="demo-simple-select-filled-label">
                    Languages
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    name="languages"
                    label="Languages"
                    value={form.languages}
                    onChange={handleChange('languages')}
                  >
                    {languages.map((language, index) => {
                      return (
                        <MenuItem
                          key={('language-', index)}
                          value={language.code}
                        >
                          {language.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <Grid spacing={4} container>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid item xs={6}>
                      <KeyboardDatePicker
                        margin="normal"
                        fullWidth
                        id="date-picker-dialog"
                        label="From"
                        format="yyyy/MM/dd"
                        value={form.fromDate}
                        onChange={handleChange('fromDate')}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <KeyboardDatePicker
                        fullWidth
                        margin="normal"
                        id="date-picker-dialog"
                        label="To"
                        format="yyyy/MM/dd"
                        value={form.toDate}
                        onChange={handleChange('toDate')}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                </Grid>
              </React.Fragment>
            )}
          </Grid>
          <br />
          <Grid container alignItems="center" justify="flex-end">
            <Button onClick={onAddFilter} color="primary" variant="outlined">
              Filter
            </Button>
          </Grid>
        </Box>
      </Card>
    </Grid>
  );
};

export default NewsFilterBox;
