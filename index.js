const options = [
  {
    id: 0,
    text: 'Gender',
  },
  {
    id: 1,
    text: 'Age',
  },
  {
    id: 2,
    text: 'Race',
  },
  {
    id: 3,
    text: 'Education',
  },
  {
    id: 4,
    text: 'Household Income',
  },
  {
    id: 5,
    text: 'Employment Status',
  },
  {
    id: 6,
    text: 'Time Poverty Status',
  },
  {
    id: 7,
    text: 'Main Mode of Transportation',
  },
];

let globalData;

let selections = {};

const filters = {
  Gender: [
    { text: 'Male', id: 'female', value: '0.0' },
    { text: 'Female', id: 'female', value: '1.0' },
  ],
  Age: [
    { text: '15-19', id: 'age_15_19', value: '1.0' },
    { text: '20-29', id: 'age_20_29', value: '1.0' },
    { text: '30-49', id: 'age_30_49', value: '1.0' },
    { text: '50-64', id: 'age_50_64', value: '1.0' },
    { text: '65-75', id: 'age_65p', value: '1.0' },
    { text: '75+', id: 'age_75p', value: '1.0' },
  ],
  Race: [
    { text: 'White', id: 'white', value: '1.0' },
    { text: 'Black', id: 'black', value: '1.0' },
    { text: 'Asian', id: 'asian', value: '1.0' },
  ],
  Education: [
    { text: 'Less than High School', id: 'less_than_hs', value: '1.0' },
    { text: 'High School Graduate', id: 'hs_grad', value: '1.0' },
    { text: 'Associate Degree', id: 'some_col_assc_deg', value: '1.0' },
    { text: 'Bachelor Degree', id: 'bachelor', value: '1.0' },
    { text: 'Graduate School', id: 'grad_sch', value: '1.0' },
  ],
  'Household Income': [
    { text: 'Less than 35k', id: 'inc_up35', value: '1.0' },
    { text: '35K-50K', id: 'inc_35_50', value: '1.0' },
    { text: '50KK-75K', id: 'inc_50_75', value: '1.0' },
    { text: '75K-100K', id: 'inc_75_100', value: '1.0' },
    { text: '75K-100K', id: 'inc_100p', value: '1.0' },
  ],
  'Employment Status': [
    { text: 'Employed', id: 'employed', value: '1.0' },
    { text: 'Unemployed', id: 'employed', value: '0.0' },
  ],
  'Time Poverty Status': [
    { text: 'Time Poor', id: 'time_poor', value: '1.0' },
    { text: 'Not Time Poor', id: 'time_poor', value: '1.0' },
  ],
  'Main Mode of Transportation': [
    { text: 'Car User', id: 'car_user', value: '1.0' },
    { text: 'Other', id: 'car_user', value: '0.0' },
  ],
};

document.addEventListener('DOMContentLoaded', function () {
  Promise.resolve(d3.csv('data/df.csv')).then((data) => {
    globalData = data;
    $('.js-example-basic-single').select2({
      placeholder: 'Select upto 3 filters...',
      data: options,
    });
    showFilters();
  });
});

function showFilters() {
  $('#filters-selector').empty();
  const type = $('#options-selector').select2('data');
  filterElement = document.getElementById('filters-selector');
  filters[type[0].text].forEach((filter) => {
    let op = document.createElement('option');
    op.id = filter.text;
    op.value = filter.text;
    op.text = filter.text;
    filterElement.appendChild(op);
  });
  showSelections();
}

function showSelections() {
  const type = $('#options-selector').select2('data');
  const filter = $('#filters-selector').select2('data');
  selections[type[0].text] = filters[type[0].text].find(
    (el) => el.text === filter[0].text
  );
  let selString = '';
  Object.keys(selections).forEach((selection) => {
    selString += selection;
    selString += ': ';
    selString += selections[selection]['text'];
    selString += '\n';
  });
  const selectionsElement = document.getElementById('selections');
  selectionsElement.innerHTML = selString;
}

function showCharts() {
  plotUnWeighted();
  plotWeighted();
}

function resetCharts() {}

// function processData() {}

function plotWeighted() {
  var grouped_wb = d3.rollup(
    globalData,
    (v) => d3.sum(v, (d) => d['weighted_wb']),
    (d) => {
      return Object.keys(selections)
        .map((id) => {
          return d[selections[id]['id']] === selections[id]['value'];
        })
        .reduce((prev, curr) => {
          return prev && curr;
        });
    },
    (d) => d.year
  );
  var grouped_weight = d3.rollup(
    globalData,
    (v) => d3.sum(v, (d) => d['weight']),
    (d) => {
      return Object.keys(selections)
        .map((id) => {
          return d[selections[id]['id']] === selections[id]['value'];
        })
        .reduce((prev, curr) => {
          return prev && curr;
        });
    },
    (d) => d.year
  );

  let grouped_weighted = [];
  [...grouped_wb.get(true).keys()].forEach((item) =>
    grouped_weighted.push(
      grouped_wb.get(true).get(item) / grouped_weight.get(true).get(item)
    )
  );
  var x = [...grouped_wb.get(true).keys()];
  var y = grouped_weighted;
  var traces = [
    {
      x,
      y,
    },
  ];

  Plotly.newPlot('weighted', traces, {
    title: 'Weighted',
  });
}

function plotUnWeighted() {
  var grouped_uwb = d3.rollup(
    globalData,
    (v) => d3.mean(v, (d) => d['norm_wb']),
    (d) => {
      return Object.keys(selections)
        .map((id) => {
          return d[selections[id]['id']] === selections[id]['value'];
        })
        .reduce((prev, curr) => {
          return prev && curr;
        });
    },
    (d) => d.year
  );
  console.log(grouped_uwb.get(true).values());

  var x = [...grouped_uwb.get(true).keys()];
  var y = [...grouped_uwb.get(true).values()];
  var traces = [
    {
      x,
      y,
    },
  ];

  Plotly.newPlot('unweighted', traces, {
    title: 'Un-Weighted',
  });
}
