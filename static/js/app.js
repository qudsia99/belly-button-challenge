// Specify the URL of the JSON file
const jsonUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Note: Use console.log() to debug if running into errors

// Define init function to initialize the page
function init () {
  
  // Create a dropdown menu of the sample names
  let dropdownbutton = d3.select('#selDataset');

  // Loading data inside init function
  d3.json(jsonUrl).then((data) => {

    let names = data.names;

    // Appending every sample value on dropdown menu
    names.forEach((sample) => {
      dropdownbutton.append('option').text(sample).property("value",sample);
      });

    // Create first default plot, that is initialized based on the first drop down value
    let first_default_plot = names[0]

    // Set other graphs to initialize based on the same drop-down value
    bargraph(first_default_plot)
    bubblechart(first_default_plot)
    demographicdata(first_default_plot)

  // closing parentheses for promise pending
  });
}

function bargraph(x){
  
    // Loading up data again 
    d3.json(jsonUrl).then((data) => {

    // Gathering sample data inside a retrievable variable
    all_samples = data.samples

    // Creating filter to match the drop-down value selection
    filtered_sample = all_samples.filter(sample => sample.id == x)

    // Grabbing the first value (aka matching value)
    first_sample = filtered_sample[0]

    // gathering x and y data for bar graph and otu labels for labeling
    let samp_vals = first_sample.sample_values
    let otu_ids1 = first_sample.otu_ids
    let otu_labs = first_sample.otu_labels

    let y_values = samp_vals.slice(0,10).map(id => `OTU ${id}`).reverse()
    let x_values = otu_ids1.slice(0,10).reverse()
    let labels = otu_labs.slice(0,10).reverse();
        
    // Creating the trace
    let trace = {
      x: x_values,
      y: y_values,
      text: labels,
      type: "bar",
      orientation: "h"
        };

    // Creating layout
    let layout = {
        title: "Top 10 OTU's"
        };

    // Call Plotly to plot the bar chart
    Plotly.newPlot("bar", [trace], layout)

  // closing parentheses for promise pending of bar graph
  });
}


function bubblechart(x){

  // Fetching and loading data inside bubble chart function
  d3.json(jsonUrl).then((data) => {

    // Grabbing all the samples
    let sampledata = data.samples;

    // Filtering samples to match the drop-down value
    let filtered_data = sampledata.filter(row => row.id == x);

    // Selecting first value from array
    let first_sample = filtered_data[0];

    // Grabbing otu_ids, sample_values, and otu_labels for bubble chart
    let otu_ids2 = first_sample.otu_ids;
    let otu_labels2 = first_sample.otu_labels;
    let sample_vals2 = first_sample.sample_values;

    // Setting the top ten items to display in descending order using reverse
    let x_ticks = otu_ids2.slice(0,10).map(id => `OTU ${id}`).reverse();
    let y_ticks = sample_vals2.slice(0,10).reverse();
    let labels = otu_labels2.slice(0,10).reverse();
  
    // Setting up the trace for the bar chart
    let trace1 = {
      x: otu_ids2,
      y: sample_vals2,
      text: otu_labels2,
      mode: "markers",
      marker: {
        size: sample_vals2,
        color: otu_ids2,
        colorscale: "Earth"}
    };

    // Set up the layout
    let layout1 = {
      xaxis: {title: "OTU ID"},
  };

  // Call Plotly to plot the bar chart
  Plotly.newPlot("bubble", [trace1], layout1)
  
  // closing parentheses for promise pending of the bubble chart
  });
}
  
  
function demographicdata(x){

    // Fetching data again inside the function
    d3.json(jsonUrl).then((data) => {

    // Retrieving all data for demographic information
    let metadata = data.metadata;

    // Filtering to match selected drop-down menu value 
    let filtered_meta = metadata.filter(row => row.id == x);

    // Getting the first value 
    let first_meta = filtered_meta[0];

    // Clearing out previous metadata
    d3.select("#sample-metadata").html("");

    // Utilizing object.entries function for panel key and values
    Object.entries(first_meta).forEach(([key,value]) => {

        // Appending key's values to the demographic display
        d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
    });
  }
)}

// Finally, create a function that updates all graphs upon selection from drop-down menu

  function optionChanged(x){
    demographicdata(x);
    bargraph(x);
    bubblechart(x);
    
  }

  // Call initialized function
init();