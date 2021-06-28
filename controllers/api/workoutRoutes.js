const router = require('express').Router();
const { Workout } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const lastWorkout = await Workout.find({}).sort({ date: -1 });
    res.json(lastWorkout);
  }
  catch (err) {
    res.json(err);
  }
});

router.post('/', async ({ body }, res) => {
  try {
    const newWorkout = await Workout.create(body);
    res.json(newWorkout);
  }
  catch (err) {
    res.json(err);
  }
});

router.put('/:id', async ({ params, body }, res) => {
  try {
    const newExercise = await Workout.findOneAndUpdate(
      {
        _id: params.id
      },
      {
        $push: {
          exercises: body
        }
      }
    );
    res.json(newExercise);
  }
  catch (err) {
    res.json(err);
  }
});

router.get('/range', async (req, res) => {
  try {
    const lastWorkout = await Workout.aggregate(
      [
        {
          $addFields: {
            totalDuration: {
              $sum: '$exercises.duration',
            },
            combinedWeight: {
              $sum: '$exercises.weight',
            }
          }
        },
        {
          $sort: {
            _id: -1
          }
        },
        {
          $limit: 7
        },
      ]
    )
    res.json(lastWorkout);
  }
  catch (err) {
    res.json(err);
  }
});