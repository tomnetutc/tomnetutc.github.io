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
    { text: 'Not Time Poor', id: 'time_poor', value: '0.0' },
  ],
  'Main Mode of Transportation': [
    { text: 'Car User', id: 'car_user', value: '1.0' },
    { text: 'Other', id: 'car_user', value: '0.0' },
  ],
};

let globalData;

let selections = [];

let traces = [];

let years = [];

const NUMBER_PROFILES = 3;

document.addEventListener('DOMContentLoaded', function () {
  Promise.resolve(d3.csv('data/df.csv')).then((data) => {
    globalData = data;
    selections.push({});
    traces.push({});

    const lastUpdated = document.getElementById('last-updated');

    let dateObj = new Date();
    const month = dateObj.toLocaleString('default', { month: 'long' });
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();

    let curDate = `${month} ${day}, ${year}`;

    lastUpdated.innerHTML = `Updated ${curDate}`;

    const grouped_uwb = d3.rollup(
      globalData,
      (v) => d3.mean(v, (d) => d['norm_wb']),
      (d) => d.year
    );

    const group_count = d3.rollup(
      globalData,
      (d) => d.length,
      (d) => d.year
    );

    const values = [...grouped_uwb.values()];
    years = [...grouped_uwb.keys()];
    const counts = [...group_count.values()];

    const tableDiv = document.getElementById('table');
    const table = document.createElement('table');
    table.setAttribute('class', 'table');
    table.setAttribute('id', 'main-table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    tbody.setAttribute('id', 'table-body');
    const th1 = document.createElement('th');
    th1.setAttribute('scope', 'col');
    th1.appendChild(document.createTextNode('Profile'));
    thead.appendChild(th1);
    for (let i = 0; i < years.length; i++) {
      const th = document.createElement('th');
      th.setAttribute('scope', 'col');
      th.appendChild(document.createTextNode(years[i]));
      thead.appendChild(th);
    }
    table.appendChild(thead);
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.appendChild(document.createTextNode('Profile 0'));
    const downloadButton = document.createElement('button');
    downloadButton.setAttribute('type', 'button');
    downloadButton.setAttribute('class', 'btn btn-outline-primary btn-sm m-2');
    downloadButton.setAttribute('onclick', `downloadDataSet(0)`);
    downloadButton.appendChild(document.createTextNode('Download'));
    td.appendChild(downloadButton);
    tr.appendChild(td);
    for (let i = 0; i < values.length; i++) {
      const td = document.createElement('td');
      td.appendChild(document.createTextNode(counts[i]));
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
    table.appendChild(tbody);
    tableDiv.appendChild(table);
    generateTraces(0, values);

    for (let i = 1; i <= NUMBER_PROFILES; i++) {
      selections.push({});
      traces.push({});
      const colDiv = document.createElement('div');
      colDiv.setAttribute('class', 'col-3 justify-content-md-center');

      const cardDiv = document.createElement('div');
      cardDiv.setAttribute('class', 'card border-0');

      colDiv.appendChild(cardDiv);

      const cardBody = document.createElement('div');
      cardBody.setAttribute(
        'class',
        'card-body d-flex flex-column align-items-center'
      );

      cardDiv.appendChild(cardBody);

      const title = document.createElement('h5');
      title.setAttribute('class', 'card-title');
      title.appendChild(document.createTextNode(`Profile ${i}`));

      const createButton = document.createElement('button');
      createButton.setAttribute('class', 'btn btn-primary w-100');
      createButton.setAttribute('onclick', `createProfile(${i})`);
      createButton.setAttribute('id', `create-profile-btn-${i}`);
      createButton.appendChild(document.createTextNode('Create'));

      const optionsDiv = document.createElement('div');
      optionsDiv.setAttribute('id', `profile-options-${i}`);
      optionsDiv.setAttribute(
        'class',
        'd-flex flex-column align-items-center invisible w-100 gap-3 stylePosition'
      );

      const optionsSelector = document.createElement('select');
      optionsSelector.setAttribute('id', `options-selector-${i}`);
      optionsSelector.setAttribute('class', 'w-100 my-3');

      const filtersSelector = document.createElement('select');
      filtersSelector.setAttribute('id', `filters-selector-${i}`);
      filtersSelector.setAttribute('class', 'w-100');

      const blankOption = document.createElement('option');
      blankOption.setAttribute('value', '');

      filtersSelector.appendChild(blankOption);

      const removeButton = document.createElement('button');
      removeButton.setAttribute('class', 'btn btn-primary w-100');
      removeButton.setAttribute('onclick', `removeProfile(${i})`);
      removeButton.setAttribute('id', `remove-profile-btn-${i}`);
      removeButton.appendChild(document.createTextNode('Remove'));

      const selectionsDiv = document.createElement('div');
      selectionsDiv.setAttribute('id', `selections-${i}`);
      selectionsDiv.setAttribute(
        'class',
        'd-flex justify-content-around flex-wrap'
      );

      optionsDiv.appendChild(optionsSelector);
      optionsDiv.appendChild(filtersSelector);
      optionsDiv.appendChild(removeButton);
      optionsDiv.appendChild(selectionsDiv);

      cardBody.appendChild(title);
      cardBody.appendChild(createButton);
      cardBody.appendChild(optionsDiv);

      const profilesDiv = document.getElementById('profiles');
      profilesDiv.appendChild(colDiv);

      $(`#options-selector-${i}`).select2({
        placeholder: 'Select upto 3 attributes',
        data: options,
      });

      optionsSelector.appendChild(blankOption);

      $(`#filters-selector-${i}`).select2({
        placeholder: 'Select a level',
      });

      $(`#options-selector-${i}`).on('select2:select', function (e) {
        createFilters(i, e.params.data['text']);
      });

      $(`#filters-selector-${i}`).on('select2:select', function (e) {
        const type = $(`#options-selector-${i}`).select2('data');
        const data = e.params.data;
        const selectionsElement = document.getElementById(`selections-${i}`);
        const filterElement = document.getElementById(`${type[0].text}-${i}`);
        if (filterElement) {
          filterElement.innerText = data.text;
          let alertButton = document.createElement('button');
          alertButton.setAttribute('type', 'button');
          alertButton.setAttribute(
            'class',
            'btn-close filterAlertCloseBtn p-0'
          );
          alertButton.setAttribute('data-bs-dismiss', 'alert');
          alertButton.setAttribute(
            'onclick',
            'removeFilter(this.parentNode.id)'
          );
          filterElement.appendChild(alertButton);
        } else {
          let alertDiv = document.createElement('div');
          alertDiv.setAttribute('id', `${type[0].text}-${i}`);
          alertDiv.setAttribute(
            'class',
            'alert alert-primary alert-dismissible fade show filterAlertDiv m-1'
          );
          alertDiv.setAttribute('role', 'alert');
          alertDiv.innerText = data.text;

          selectionsElement.appendChild(alertDiv);
          let alertButton = document.createElement('button');
          alertButton.setAttribute('type', 'button');
          alertButton.setAttribute(
            'class',
            'btn-close filterAlertCloseBtn p-0'
          );
          alertButton.setAttribute('data-bs-dismiss', 'alert');
          alertButton.setAttribute(
            'onclick',
            'removeFilter(this.parentNode.id)'
          );
          alertDiv.appendChild(alertButton);
        }
        selections[i][type[0].text] = filters[type[0].text].find(
          (el) => el.text === data.text
        );
        plotUnWeighted(i);
      });
    }

    plotHeatMap(data);
  });
});

function createProfile(key) {
  $(`#create-profile-btn-${key}`).addClass('invisible');
  $(`#profile-options-${key}`).removeClass('invisible');
}

function removeProfile(key) {
  $(`#create-profile-btn-${key}`).removeClass('invisible');
  $(`#profile-options-${key}`).addClass('invisible');
  purgeCharts(key);
}

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
  const grouped_uwb = d3.rollup(
    globalData,
    (v) => d3.mean(v, (d) => d['norm_wb']),
    (d) => {
      return Object.keys(selections[key])
        .map((id) => {
          return d[selections[key][id]['id']] === selections[key][id]['value'];
        })
        .reduce((prev, curr) => {
          return prev && curr;
        });
    },
    (d) => d.year
  );
  const group_count = d3.rollup(
    globalData,
    (d) => d.length,
    (d) => {
      return Object.keys(selections[key])
        .map((id) => {
          return d[selections[key][id]['id']] === selections[key][id]['value'];
        })
        .reduce((prev, curr) => {
          return prev && curr;
        });
    },
    (d) => d.year
  );
  const values = [...grouped_uwb.get(true).values()];
  const counts = [...group_count.get(true).values()];
  const tableBody = document.getElementById('table-body');
  const tableRow = document.getElementById(`table-profile-${key}`);
  if (tableRow) {
    let els = [];
    const td = document.createElement('td');
    td.appendChild(document.createTextNode(`Profile ${key}`));
    const downloadButton = document.createElement('button');
    downloadButton.setAttribute('type', 'button');
    downloadButton.setAttribute('class', 'btn btn-outline-primary btn-sm m-2');
    downloadButton.setAttribute('onclick', `downloadDataSet(${key})`);
    downloadButton.appendChild(document.createTextNode('Download'));
    td.appendChild(downloadButton);
    els.push(td);
    for (let i = 0; i < counts.length; i++) {
      const td = document.createElement('td');
      td.appendChild(document.createTextNode(counts[i]));
      els.push(td);
    }
    tableRow.replaceChildren(...els);
  } else {
    const tr = document.createElement('tr');
    tr.setAttribute('id', `table-profile-${key}`);
    const td = document.createElement('td');
    td.appendChild(document.createTextNode(`Profile ${key}`));
    const downloadButton = document.createElement('button');
    downloadButton.setAttribute('type', 'button');
    downloadButton.setAttribute('class', 'btn btn-outline-primary btn-sm m-2');
    downloadButton.setAttribute('onclick', `downloadDataSet(${key})`);
    downloadButton.appendChild(document.createTextNode('Download'));
    td.appendChild(downloadButton);
    tr.appendChild(td);
    for (let i = 0; i < counts.length; i++) {
      const td = document.createElement('td');
      td.appendChild(document.createTextNode(counts[i]));
      tr.appendChild(td);
    }
    tableBody.appendChild(tr);
  }
  generateTraces(key, values);
}

function generateTraces(key, values) {
  const x = years.length ? years : [];
  const y = values.length ? values : [];

  traces[key] = {
    x,
    y,
    name: `Profile ${key}`,
  };

  let localmin = traces.map((trace) => {
    return 'y' in trace && trace['y'].length
      ? trace['y'].reduce((prev, curr) => (prev < curr ? prev : curr))
      : Number.MAX_VALUE;
  });

  let localmax = traces.map((trace) => {
    return 'y' in trace && trace['y'].length
      ? trace['y'].reduce((prev, curr) => (prev > curr ? prev : curr))
      : Number.MIN_VALUE;
  });

  let globalmin = localmin.reduce((prev, curr) => (prev < curr ? prev : curr));
  let globalmax = localmax.reduce((prev, curr) => (prev > curr ? prev : curr));

  const layout = {
    title: 'Average daily well-being',

    xaxis: {
      title: 'Year',
      showgrid: true,
      zeroline: false,
    },

    yaxis: {
      title: 'Value',
      showline: false,
      range: [globalmin - 2, globalmax + 2],
    },
    showlegend: true,
  };

  Plotly.newPlot('unweighted', traces, layout);
}

function purgeCharts(key) {
  traces[key] = {};
  generateTraces(key, [], '');
  $(`#options-selector-${key}`).empty().trigger('change');
  $(`#options-selector-${key}`).append(new Option()).trigger('change');
  $(`#options-selector-${key}`).select2({
    placeholder: 'Select upto 3 attributes',
    data: options,
  });
  $(`#filters-selector-${key}`).empty().trigger('change');
  $(`#filters-selector-${key}`).append(new Option()).trigger('change');
  const selectionsElement = document.getElementById(`selections-${key}`);
  const tableRow = document.getElementById(`table-profile-${key}`);
  selectionsElement.innerHTML = '';
  tableRow.innerHTML = '';
}

function createFilters(key, data) {
  $(`#filters-selector-${key}`).empty().trigger('change');
  $(`#filters-selector-${key}`).append(new Option()).trigger('change');
  filters[data].forEach((filter) => {
    const option = {
      id: filter.text,
      text: filter.text,
    };
    const newOption = new Option(option.text, option.id, false, false);
    $(`#filters-selector-${key}`).append(newOption).trigger('change');
  });
}

function removeFilter(id) {
  const option = id.split('-')[0];
  const number = id.split('-')[1];
  delete selections[number][option];
  const curOption = $(`#options-selector-${number}`).select2('data');
  if (curOption[0]['text'] === option) {
    $(`#filters-selector-${number}`).empty().trigger('change');
    $(`#filters-selector-${number}`).append(new Option()).trigger('change');
    createFilters(number, curOption[0]['text']);
  }
  if (!Object.keys(selections[number]).length) {
    purgeCharts(number);
  } else {
    plotUnWeighted(number);
  }
}

function downloadDataSet(key) {
  if (key == 0) {
    const fileName = `profile-${key}`;
    exportFromJSON({
      data: globalData,
      fileName,
      fields: [],
      exportType: 'csv',
    });
  } else {
    const group = d3.group(globalData, (d) => {
      return Object.keys(selections[key])
        .map((id) => {
          return d[selections[key][id]['id']] === selections[key][id]['value'];
        })
        .reduce((prev, curr) => {
          return prev && curr;
        });
    });
    const fileName = `profile-${key}`;
    const data = [...group.get(true).values()];
    exportFromJSON({ data, fileName, fields: [], exportType: 'csv' });
  }
}

function unpack(rows, key) {
  return rows.map(function (row) {
    return row[key];
  });
}

function plotHeatMap(data) {
  var data = [
    {
      type: 'choropleth',

      locationmode: 'USA-states',

      locations: unpack(data, 'state'),

      z: unpack(data, 'norm_wb'),

      text: unpack(data, 'state'),

      zmin: 0,

      zmax: 17000,

      colorscale: [
        [0, 'rgb(242,240,247)'],
        [0.2, 'rgb(218,218,235)'],

        [0.4, 'rgb(188,189,220)'],
        [0.6, 'rgb(158,154,200)'],

        [0.8, 'rgb(117,107,177)'],
        [1, 'rgb(84,39,143)'],
      ],

      colorbar: {
        title: 'Millions USD',

        thickness: 0.2,
      },

      marker: {
        line: {
          color: 'rgb(255,255,255)',

          width: 2,
        },
      },
    },
  ];

  var layout = {
    title: '2011 US Agriculture Exports by State',

    geo: {
      scope: 'usa',

      showlakes: true,

      lakecolor: 'rgb(255,255,255)',
    },
  };

  Plotly.newPlot('heatmap', data, layout, { showLink: false });
}
