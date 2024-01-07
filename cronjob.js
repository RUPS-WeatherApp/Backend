import cron from 'node-cron';

var task = cron.schedule('* * * * * *', () =>  {
  console.log('stopped task');
});


task.start();
