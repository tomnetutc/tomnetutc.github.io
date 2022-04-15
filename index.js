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

let selections1 = {};
let selections2 = {};
let selections3 = {};

const filters = {
  Gender: [
    { text: 'Male', id: 'female', value: '0.0' },
    { text: 'Female', id: 'female', value: '1.0' },
  ],
  Age: [
    { text: '15-19 old', id: 'age_15_19', value: '1.0' },
    { text: '20-29 old', id: 'age_20_29', value: '1.0' },
    { text: '30-49 old', id: 'age_30_49', value: '1.0' },
    { text: '50-64 old', id: 'age_50_64', value: '1.0' },
    { text: '65-75 old', id: 'age_65p', value: '1.0' },
    { text: '75+ old', id: 'age_75p', value: '1.0' },
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
    { text: 'Less than 35k income', id: 'inc_up35', value: '1.0' },
    { text: '35K-50K income', id: 'inc_35_50', value: '1.0' },
    { text: '50K-75K income', id: 'inc_50_75', value: '1.0' },
    { text: '75K-100K income', id: 'inc_75_100', value: '1.0' },
    { text: '100K+ income', id: 'inc_100p', value: '1.0' },
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
    $('.js-example-basic-pf1-one').select2({
      placeholder: 'Select upto 3 attributes',
      data: options,
    });
    $('.js-example-basic-pf1-two').select2({
      placeholder: 'Select a level',
    });
    $('.js-example-basic-pf2-one').select2({
      placeholder: 'Select upto 3 attributes',
      data: options,
    });
    $('.js-example-basic-pf2-two').select2({
      placeholder: 'Select a level',
    });
    $('.js-example-basic-pf3-one').select2({
      placeholder: 'Select upto 3 attributes',
      data: options,
    });
    $('.js-example-basic-pf3-two').select2({
      placeholder: 'Select a level',
    });
  });
  $('#options-selector-1').on('select2:select', function (e) {
    $('#filters-selector-1').empty().trigger('change');
    $('#filters-selector-1').append(new Option()).trigger('change');
    const data = e.params.data;
    filters[data.text].forEach((filter) => {
      const option = {
        id: filter.text,
        text: filter.text,
      };
      const newOption = new Option(option.text, option.id, false, false);
      $('#filters-selector-1').append(newOption).trigger('change');
    });
  });

  $('#filters-selector-1').on('select2:select', function (e) {
    const type = $('#options-selector-1').select2('data');
    const data = e.params.data;
    console.log(data);
    const selectionsElement = document.getElementById('selections-1');
    const filterElement = document.getElementById(type[0].text + '1');
    if (filterElement) {
      filterElement.innerText = data.text;
    } else {
      var aTag = document.createElement('button');
      aTag.setAttribute('type', 'button');
      aTag.setAttribute('id', type[0].text + '1');
      aTag.setAttribute('class', 'btn bg-info text-dark m-2');
      aTag.innerText = data.text;
      selectionsElement.appendChild(aTag);
    }
    selections1[type[0].text] = filters[type[0].text].find(
      (el) => el.text === data.text
    );
    plotUnWeighted(1);
  });

  $('#options-selector-2').on('select2:select', function (e) {
    $('#filters-selector-2').empty().trigger('change');
    $('#filters-selector-2').append(new Option()).trigger('change');
    const data = e.params.data;
    filters[data.text].forEach((filter) => {
      const option = {
        id: filter.text,
        text: filter.text,
      };
      const newOption = new Option(option.text, option.id, false, false);
      $('#filters-selector-2').append(newOption).trigger('change');
    });
  });

  $('#filters-selector-2').on('select2:select', function (e) {
    const type = $('#options-selector-2').select2('data');
    const data = e.params.data;
    console.log(data);
    const selectionsElement = document.getElementById('selections-2');
    const filterElement = document.getElementById(type[0].text + '2');
    if (filterElement) {
      filterElement.innerText = data.text;
    } else {
      var aTag = document.createElement('button');
      aTag.setAttribute('type', 'button');
      aTag.setAttribute('id', type[0].text + '2');
      aTag.setAttribute('class', 'btn bg-info text-dark m-2');
      aTag.innerText = data.text;
      selectionsElement.appendChild(aTag);
    }
    selections2[type[0].text] = filters[type[0].text].find(
      (el) => el.text === data.text
    );
    plotUnWeighted(2);
  });
  $('#options-selector-3').on('select2:select', function (e) {
    $('#filters-selector-3').empty().trigger('change');
    $('#filters-selector-3').append(new Option()).trigger('change');
    const data = e.params.data;
    filters[data.text].forEach((filter) => {
      const option = {
        id: filter.text,
        text: filter.text,
      };
      const newOption = new Option(option.text, option.id, false, false);
      $('#filters-selector-3').append(newOption).trigger('change');
    });
  });

  $('#filters-selector-3').on('select2:select', function (e) {
    const type = $('#options-selector-3').select2('data');
    const data = e.params.data;
    const selectionsElement = document.getElementById('selections-3');
    const filterElement = document.getElementById(type[0].text + '3');
    if (filterElement) {
      filterElement.innerText = data.text;
    } else {
      var aTag = document.createElement('button');
      aTag.setAttribute('type', 'button');
      aTag.setAttribute('id', type[0].text + '3');
      aTag.setAttribute('class', 'btn bg-info text-dark m-2');
      aTag.innerText = data.text;
      selectionsElement.appendChild(aTag);
    }
    selections3[type[0].text] = filters[type[0].text].find(
      (el) => el.text === data.text
    );
    plotUnWeighted(3);
  });
});

function resetCharts() {}

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

function plotUnWeighted(key) {
  console.log(key);
  let graphName = '';
  if (key == 1) {
    var grouped_uwb = d3.rollup(
      globalData,
      (v) => d3.mean(v, (d) => d['norm_wb']),
      (d) => {
        return Object.keys(selections1)
          .map((id) => {
            return d[selections1[id]['id']] === selections1[id]['value'];
          })
          .reduce((prev, curr) => {
            return prev && curr;
          });
      },
      (d) => d.year
    );
    var group_count = d3.rollup(
      globalData,
      (d) => d.length,
      (d) => {
        return Object.keys(selections1)
          .map((id) => {
            return d[selections1[id]['id']] === selections1[id]['value'];
          })
          .reduce((prev, curr) => {
            return prev && curr;
          });
      },
      (d) => d.year
    );
    const years = [...group_count.get(true).keys()];
    const values = [...group_count.get(true).values()];
    const table1 = document.getElementById('table-1');
    $('#main-table-1').remove();
    const table = document.createElement('table');
    table.setAttribute('class', 'table');
    table.setAttribute('id', 'main-table-1');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const th1 = document.createElement('th');
    th1.setAttribute('scope', 'col');
    th1.appendChild(document.createTextNode('Year'));
    const th2 = document.createElement('th');
    th2.setAttribute('scope', 'col');
    th2.appendChild(document.createTextNode('Count'));
    thead.appendChild(th1);
    thead.appendChild(th2);
    table.appendChild(thead);
    for (let i = 0; i < years.length; i++) {
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.setAttribute('scope', 'row');
      th.appendChild(document.createTextNode(years[i]));
      const td = document.createElement('td');
      td.appendChild(document.createTextNode(values[i]));
      tr.appendChild(th);
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    table1.appendChild(table);
    Object.keys(selections1).forEach((id, i) => {
      graphName += (i == 0 ? '' : ', ') + selections1[id]['text'];
    });
  } else if (key == 2) {
    var grouped_uwb = d3.rollup(
      globalData,
      (v) => d3.mean(v, (d) => d['norm_wb']),
      (d) => {
        return Object.keys(selections2)
          .map((id) => {
            return d[selections2[id]['id']] === selections2[id]['value'];
          })
          .reduce((prev, curr) => {
            return prev && curr;
          });
      },
      (d) => d.year
    );
    var group_count = d3.rollup(
      globalData,
      (d) => d.length,
      (d) => {
        return Object.keys(selections2)
          .map((id) => {
            return d[selections2[id]['id']] === selections2[id]['value'];
          })
          .reduce((prev, curr) => {
            return prev && curr;
          });
      },
      (d) => d.year
    );
    const years = [...group_count.get(true).keys()];
    const values = [...group_count.get(true).values()];
    const table2 = document.getElementById('table-2');
    $('#main-table-2').remove();
    const table = document.createElement('table');
    table.setAttribute('class', 'table');
    table.setAttribute('id', 'main-table-2');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const th1 = document.createElement('th');
    th1.setAttribute('scope', 'col');
    th1.appendChild(document.createTextNode('Year'));
    const th2 = document.createElement('th');
    th2.setAttribute('scope', 'col');
    th2.appendChild(document.createTextNode('Count'));
    thead.appendChild(th1);
    thead.appendChild(th2);
    table.appendChild(thead);
    for (let i = 0; i < years.length; i++) {
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.setAttribute('scope', 'row');
      th.appendChild(document.createTextNode(years[i]));
      const td = document.createElement('td');
      td.appendChild(document.createTextNode(values[i]));
      tr.appendChild(th);
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    table2.appendChild(table);
    Object.keys(selections2).forEach((id, i) => {
      graphName += (i == 0 ? '' : ', ') + selections2[id]['text'];
    });
  } else {
    var grouped_uwb = d3.rollup(
      globalData,
      (v) => d3.mean(v, (d) => d['norm_wb']),
      (d) => {
        return Object.keys(selections3)
          .map((id) => {
            return d[selections3[id]['id']] === selections3[id]['value'];
          })
          .reduce((prev, curr) => {
            return prev && curr;
          });
      },
      (d) => d.year
    );
    var group_count = d3.rollup(
      globalData,
      (d) => d.length,
      (d) => {
        return Object.keys(selections3)
          .map((id) => {
            return d[selections3[id]['id']] === selections3[id]['value'];
          })
          .reduce((prev, curr) => {
            return prev && curr;
          });
      },
      (d) => d.year
    );
    const years = [...group_count.get(true).keys()];
    const values = [...group_count.get(true).values()];
    const table3 = document.getElementById('table-3');
    $('#main-table-3').remove();
    const table = document.createElement('table');
    table.setAttribute('class', 'table');
    table.setAttribute('id', 'main-table-3');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const th1 = document.createElement('th');
    th1.setAttribute('scope', 'col');
    th1.appendChild(document.createTextNode('Year'));
    const th2 = document.createElement('th');
    th2.setAttribute('scope', 'col');
    th2.appendChild(document.createTextNode('Count'));
    thead.appendChild(th1);
    thead.appendChild(th2);
    table.appendChild(thead);
    for (let i = 0; i < years.length; i++) {
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.setAttribute('scope', 'row');
      th.appendChild(document.createTextNode(years[i]));
      const td = document.createElement('td');
      td.appendChild(document.createTextNode(values[i]));
      tr.appendChild(th);
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    table3.appendChild(table);
    Object.keys(selections3).forEach((id, i) => {
      graphName += (i == 0 ? '' : ', ') + selections3[id]['text'];
    });
  }
  var x = [...grouped_uwb.get(true).keys()];
  var y = [...grouped_uwb.get(true).values()];
  var traces = [
    {
      x,
      y,
    },
  ];

  var layout = {
    title: `Average daily well-being for ${graphName}`,

    xaxis: {
      title: 'Year',
      showgrid: true,
      zeroline: false,
    },

    yaxis: {
      title: 'Value',
      showline: false,
    },
    legend: {
      title: {
        text: 'Unweighted well-being value',
      },
    },
    showlegend: true,
  };

  Plotly.newPlot('unweighted-' + key, traces, layout);
}
