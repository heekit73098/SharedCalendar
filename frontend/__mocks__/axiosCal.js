var today = new Date();

'use strict';
module.exports = {
    get: () => {
        return Promise.resolve({
            data: [
                {
                  id: '1',
                  calendarId: '0',
                  title: 'TOAST UI Calendar Study',
                  category: 'time',
                  start: today,
                  end: today,
                },
                {
                  id: '2',
                  calendarId: '0',
                  title: 'Practice',
                  category: 'milestone',
                  start: today,
                  end: today,
                  isReadOnly: true,
                },
                {
                  id: '3',
                  calendarId: '0',
                  title: 'FE Workshop',
                  category: 'allday',
                  start: today,
                  end: today,
                  isReadOnly: true,
                },
                {
                  id: '4',
                  calendarId: '0',
                  title: 'Report',
                  category: 'time',
                  start: today,
                  end: today,
                },
              ]
        });
    }
};