// Loaded JSON data.
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

d3.json(url).then(function(data) {
    // Set up variables to access data.
    let names = data.names;
    let metadata = data.metadata;
    let samples = data.samples;

    // Sorted samples.
    let sorted_samples = samples.sort();
       
    // Created function to plot data of first id, so page loads with some data initially.
    function init() {
        // Set up variables to contain data used in plots.
        subject_id = sorted_samples[0]['id'];
        otu_ids = sorted_samples[0]['otu_ids'];
        values = sorted_samples[0]['sample_values'];
        otu_labels = sorted_samples[0]['otu_labels'];     
                
        // Created bar chart.
        let bar_chart_trace = [{
            x: values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(x => `OTU ${x}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        }];
    
        Plotly.newPlot("bar", bar_chart_trace);
        
        // Created bubble chart.
        let bubble_trace = [{
            x: otu_ids,
            y: values,
            mode: 'markers',
            marker: {
                size: values,
                sizemode: "diameter",
                color: otu_ids
            },
            text: otu_labels,
            type: 'bubble',
        }];

        Plotly.newPlot("bubble", bubble_trace);
        
        // Looped through data and appended demographic info for first id to newly created "table" in "sample-metadata". 
        let demo_info = d3.select("#sample-metadata").append("table");

        let metadata_keys = Object.keys(metadata[0]);
        let metadata_values = Object.values(metadata[0]);
        
        for (let i = 0; i < metadata_keys.length; i++)
            demo_info.append("tr").attr("class", metadata_keys[i]).text(`${metadata_keys[i]}: ${metadata_values[i]}`);

    };
    
    // Looped through names and added them to the dropdown.
    for (let i = 0; i < names.length; i++) {
        d3.select("select").append("option").text(names[i]);
    };

    // Set up to select new data on change and generate data from optionChanged().
    d3.selectAll("#selDataset").on("change", optionChanged);
   
    // Created function to change demographic info and charts based on selected id from dropdown.
    function optionChanged() {
        // Set current id to id selected in dropdown.
        let current_id = d3.select("#selDataset").property("value");

        // Updated charts and table given a new id selected. Same code as above just iterating through now.
        for (let i = 0; i < sorted_samples.length; i++) {
            
            if (sorted_samples[i]["id"] == current_id) {

                c_subject_id = sorted_samples[i]['id'];
                c_otu_ids = sorted_samples[i]['otu_ids'];
                c_values = sorted_samples[i]['sample_values'];
                c_otu_labels = sorted_samples[i]['otu_labels'];
            
                let bar_chart_trace = {
                    x: [c_values.slice(0,10).reverse()],
                    y: [c_otu_ids.slice(0,10).map(i => `OTU ${i}`).reverse()],
                    text: [c_otu_labels.slice(0,10).reverse()],
                };

                let bubble_trace = {
                    x: [c_otu_ids],
                    y: [c_values],
                    mode: 'markers',
                    marker: {
                        size: c_values,
                        color: c_otu_ids
                    },
                    text: [c_otu_labels]                    
                };

                Plotly.restyle("bar", bar_chart_trace);
                Plotly.restyle("bubble", bubble_trace);

                for (let i = 0; i < metadata.length; i++) {
                    
                    if (metadata[i]["id"] == current_id) {
                        let table = d3.select("table");                
                        let c_metadata_keys = Object.keys(metadata[i]);
                        let c_metadata_values = Object.values(metadata[i]);
        
                        for (let i = 0; i < c_metadata_keys.length; i++)
                            d3.select(`.${c_metadata_keys[i]}`).text(`${c_metadata_keys[i]}: ${c_metadata_values[i]}`);
                    }
                }

            }
        }
    }
    init();
});
