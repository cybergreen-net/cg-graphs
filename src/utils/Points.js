import axios from 'axios';

class Points {
  constructor(data) {
    this.xPoints = [];
    this.yPoints = [];
    for (var i = 0; i < data.length; i++) {
      this.xPoints.push(data[i].date );
      this.yPoints.push(data[i].count_amplified / 1000000);
    }
  }
}

function setDataFromUrl(self, url, name) {
  axios.get(url).then((res) => {
    const points = new Points(res.data.results);
    let trace = {
      x: points.xPoints,
      y: points.yPoints,
      name: name,
      type: 'bar'
    };
    self.setState({
      data: self.state.data.concat(trace)
    });
  });
}

export default setDataFromUrl;