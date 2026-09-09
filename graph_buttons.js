let display_text_option = "";
const graphHolder = document.getElementById("graph-holder");
let myChart = null;

function drawGraph () {
  const placement = document.getElementById("graph-placement");
  placement.innerHTML = "";

  const graph_ctx = document.createElement("canvas");
  document.getElementById("graph-placement").appendChild(graph_ctx);

  myChart = new Chart(graph_ctx, {
    type : "line",
    options : {
      animation : false
    },
    data : {
      labels : timeArray,
      datasets : [{
         fill : false,
         lineTension : 0,
         backgroundColor: "rgba(136,238,136,1.000)",
         borderColor: "rgba(136,238,136,1.000)",
         data : stateArray
      }]
    },
    options: {
    plugins: {
      legend: {display:false},
      title: {
        display: true,
          text: "LIVE SIMULATION",
          font : {
              family : "Hornet"
          },
          color : "rgba(136,238,136,1.000)"
        }
      },
      scales : {
        y : {
          grid: {
            color : "rgba(136,238,136,1.000)"
          },
          border : {
            color : "rgba(136,238,136,1.000)"
          },
          ticks : {
            color : "rgba(136,238,136,1.000)",
            font : {
              family : "Hornet"
            },
          },
          title : {
            display: true,
            text : display_text_option + " (" + graphUnit + ")",
            font : {
              family : "Hornet"
            },
            color: "rgba(136,238,136,1.000)"
          }
        },
        x : {
          grid : {
            color : "rgba(136,238,136,1.000)"
          },
          border : {
            color : "rgba(136,238,136,1.000)"
          },
          ticks : {
           color : "rgba(136,238,136,1.000)",
            font : {
              family : "Hornet"
            }
          },
          title : {
            display: true,
            text : "TIME (MS)",
            font : {
              family : "Hornet"
            },
            color: "rgba(136,238,136,1.000)"
          }
        }
      }
    }
  });
}

function updateGraph() {
  if (myChart) {
    myChart.data.labels = timeArray;
    myChart.data.datasets[0].data = stateArray;
    myChart.update('none');
  }
}

let steadyInterval = 0;
function requestNewGraph () {
  stateArray = [];

  if (steadyInterval) clearInterval(steadyInterval);

  steadyInterval = setInterval(updateGraph, 100);
  $(graphHolder).slideDown(function () {
    drawGraph();
  });
}

document.getElementById("close-graph").onclick = function () {
  $(graphHolder).slideUp();
}

const toggleMode = document.getElementById("toggle-mode");
document.getElementById("toggle-view").onclick = function () {
  switch (toggleView) {
    case 0:
      toggleView = 1;
      toggleMode.innerText = "1";
      break;
    case 1:
      toggleView = 0;
      toggleMode.innerText = "0";
      break;
  }
};

document.getElementById("dcbus-graph").onclick = function () {
  arraySelection = 0;
  display_text_option = "DC Bus Voltage";
  requestNewGraph();
}

document.getElementById("bcvi-graph1").onclick = function () {
  arraySelection = 1;
  display_text_option = "Boost Converter Voltage Input";
  requestNewGraph();
}

document.getElementById("bcvi-graph2").onclick = function () {
  arraySelection = 2;
  display_text_option = "Boost Converter Voltage Output";
  requestNewGraph();
}

document.getElementById("bciv-graph1").onclick = function () {
  arraySelection = 3;
  display_text_option = "Buck Converter Input Voltage";
  requestNewGraph();
}

document.getElementById("bciv-graph2").onclick = function () {
  arraySelection = 4;
  display_text_option = "Buck Converter Output Voltage";
  requestNewGraph();
}

document.getElementById("pvt-graph").onclick = function () {
  arraySelection = 5;
  display_text_option = "Photovoltaic Thermal Dynamics";
  requestNewGraph();
}

document.getElementById("bsoc-graph").onclick = function () {
  arraySelection = 6;
  display_text_option = "Battery State of Charge";
  requestNewGraph();
}

document.getElementById("bpolar-graph").onclick = function () {
  arraySelection = 7;
  display_text_option = "Battery Polarization Voltage";
  requestNewGraph();
}

document.getElementById("bterminal-graph").onclick = function () {
  arraySelection = 8;
  display_text_option = "Battery Terminal Voltage";
  requestNewGraph();
}

document.getElementById("dae-graph").onclick = function () {
  arraySelection = 9;
  display_text_option = "DAE Representation";
  requestNewGraph();
}