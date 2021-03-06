const express = require('express');
const router = express.Router();
const { pool } = require('../config');
// const { getDirections } = require(`./maps`);

const setDistanceTime = async function (jobs, jobberCoords) {
  for (let job of jobs) {
    await getDirections(jobberCoords, job.post_code)
      .then((directions) => {
        job.distance = directions.distance;
        job.time = directions.time;
      })
  }
  return jobs
} 

router.get('/', (req, res) => {
  console.log(req.query)
  if (req.query.id) {
    console.log(req)
    const queryString = `
    SELECT jobs.*, users.name FROM jobs 
    JOIN users ON jobs.user_id = users.id
    WHERE jobs.id=${req.query.id}`;
    pool.query(queryString, (error, results) => {
      if (error) {
        throw error
      }
      if (results.rows.length > 0) {
        res.json(results.rows)
      } else {
        res.json(results.rows)
      }
    })
  } else {
    const queryString = `
    SELECT jobs.*, users.name FROM jobs 
    JOIN users ON jobs.user_id = users.id
    WHERE jobs.jobber_id IS NULL AND jobs.is_deleted=false ORDER BY jobs.id DESC`;
    pool.query(queryString, (error, results) => {
      if (error) {
        throw error
      }
      if (results.rows.length > 0) {
        res.json(results.rows)
      } 
      else {
        res.json(results.rows)
      }
    })
  }
})

router.put('/', (req, res) => {
  const jobId = req.body.params.id;
  // console.log("test", req);
  let queryString;
  console.log(req.body.params)

  if (req.body.params.dropJob) {
    queryString = `
    UPDATE jobs SET jobber_id=NULL
    WHERE id=${jobId}
    `
  } else if (req.body.params.markComplete) {
    console.log("here")
    queryString = `
    UPDATE jobs SET jobber_confirm=true
    WHERE id=${jobId}
    `
  } else if (req.body.params.confirmComplete) {
    console.log("here")
    queryString = `
    UPDATE jobs SET user_confirm=true
    WHERE id=${jobId}
    `
  } else {
    queryString = `
    UPDATE jobs SET jobber_id=${req.session.jobberId}
    WHERE id=${jobId}
    `
  }
  console.log("QS", queryString)
  // const id = [req.body[0]]
  pool.query(queryString, (error, results) => {
    // if (error) {
    //   res.json({
    //     result: false
    //   });
    //   res.json({
    //     result: true,
    //     message: "job accepted"
    //   })
    // }
  })
  res.send('okay')
})

module.exports = router;