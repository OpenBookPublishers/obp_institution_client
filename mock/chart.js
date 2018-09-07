import moment from 'moment';

// mock data
const downloadsData = [];
const beginDay = new Date().getTime();

const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5];
for (let i = 0; i < fakeY.length; i += 1) {
  downloadsData.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    y: fakeY[i],
  });
}

const downloadsData2 = [];
const fakeY2 = [1, 6, 4, 8, 3, 7, 2];
for (let i = 0; i < fakeY2.length; i += 1) {
  downloadsData2.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    y: fakeY2[i],
  });
}

const viewsData = [];
for (let i = 0; i < 12; i += 1) {
  viewsData.push({
    x: `${i + 1}`,
    y: Math.floor(Math.random() * 1000) + 200,
  });
}
export const getFakeChartData = {
  code: 200,
  downloadsData,
  downloadsData2,
  viewsData,
};

export default {
  getFakeChartData,
};
