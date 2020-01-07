const express = require('express');
const router = express.Router();
const { pool } = require('../config');

router.get('/', (req, res) => {
  console.log(req.body)
  const queryString = `SELECT * FROM jobs WHERE user_id=$1`;
  console.log(req.session.userId)
  const id = [req.session.userId];
  console.log(id)
  pool.query(queryString, id, (error, results) => {
    if (error) {
      throw error
    }
    if (results.rows.length > 0) {
      res.json(results.rows)
    } else {
      console.log(results)
    }
  })
})

router.post('/', (req, res) => {
  const { 
    name, 
    description, 
    hourly_rate, 
    time_estimate, 
    street_address,
    post_cost  
  } = req.body;
  let queryString = `
  INSERT INTO jobs(
    name, 
    user_id, 
    description, 
    hourly_rate,
    time_estimate,
    street_address,
    post_code)
  VALUES ($1, $2, $3, $4, $5, $6, $7);`
  let values = [
    name, 
    req.session.userId,
    description,
    hourly_rate,
    time_estimate,
    street_address,
    post_code
  ]
  pool.query(queryString, values, (error, results) => {
    if (error) {
      res.json({
        result: false
      });
      throw error
    }
    res.json({
      result: true,
      message: "job posted"
    });
  })
})

router.delete(':id', (req, res) => {
  console.log(req.body)
})

module.exports = router;