// Retrieve nodes
var graph_nodes = [];

lons = [];
lats = [];

jQuery.get("nodes.txt", function (nodes) {
  nodes = nodes.split(/\r?\n/);

  for (let i = 0; i < nodes.length; i++) {
    node = nodes[i];
    coords = node.split(",");
    lon = parseFloat(coords[0]);
    lat = parseFloat(coords[1]);
    lons.push(lon);
    lats.push(lat);
    graph_nodes.push({ x: lon, y: lat });
  }
});

console.log(lons);
console.log(lats);
var myPlot = document.getElementById("myDiv"),
  x = [
    -71.8100092, -71.8101401, -71.80979529999999, -71.80988839999999,
    -71.8091737, -71.8093275, -71.8086798, -71.80847419999999, -71.8082888,
    -71.80859, -71.80892039999999, -71.80941159999999, -71.8097035, -71.8101812,
    -71.810225, -71.810035, -71.8096226, -71.8094796, -71.8096458,
    -71.80991019999999, -71.80998919999999, -71.8094011, -71.809591,
    -71.8090899, -71.8090677, -71.8077749, -71.8080465, -71.8078393,
    -71.80780469999999, -71.8082281, -71.8080315, -71.8079123, -71.8078465,
    -71.80916599999999, -71.8083932, -71.8085701, -71.80864009999999,
    -71.8085998, -71.808426, -71.8082465, -71.80817689999999, -71.8087291,
    -71.8089202, -71.8091374, -71.8076645, -71.8074215, -71.8071396,
    -71.80694299999999, -71.8067392, -71.8066755, -71.8067416,
    -71.80682159999999, -71.8068894, -71.8069676, -71.8069981, -71.8070456,
    -71.8071942, -71.807416, -71.80764239999999, -71.8076908, -71.8076815,
    -71.80757229999999, -71.8075136, -71.8074504, -71.8073844, -71.8072122,
    -71.80703559999999, -71.8073634, -71.8075301, -71.80766559999999,
    -71.8077103, -71.80771399999999,
  ],
  y = [
    42.2741118, 42.2736526, 42.273842699999996, 42.2735045, 42.2741362,
    42.273454799999996, 42.274100399999995, 42.2744928, 42.274543099999995,
    42.274318, 42.2741183, 42.274146099999996, 42.2741705, 42.2739785,
    42.2737851, 42.2735504, 42.2734531, 42.2735923, 42.2737161,
    42.273954499999995, 42.2737531, 42.2740262, 42.2739423, 42.2739349,
    42.2737349, 42.2744825, 42.2745094, 42.2741579, 42.2743338, 42.2738015,
    42.273790399999996, 42.2738351, 42.2740017, 42.2735725, 42.2738373,
    42.2738248, 42.2736993, 42.2735682, 42.273540399999995, 42.273532599999996,
    42.273646199999995, 42.273451099999996, 42.273379899999995, 42.273402,
    42.2750152, 42.2751282, 42.2750528, 42.274978499999996, 42.2748829,
    42.2747059, 42.2744333, 42.2741786, 42.2739544, 42.273695, 42.2735558,
    42.2733908, 42.2733481, 42.2733747, 42.273393899999995, 42.2734387,
    42.2735602, 42.273682199999996, 42.2738681, 42.274159999999995, 42.2742864,
    42.274304099999995, 42.274305899999995, 42.2744034, 42.2744213, 42.2744504,
    42.2747746, 42.2747701,
  ],
  data = [
    {
      x: x,
      y: y,
      type: "scatter",
      mode: "markers",
      marker: { size: 8, color: `red` },
    },
  ],
  layout = {
    hovermode: "closest",
    // title: "WPI Campus Delivery Map",
    xaxis: {
      // range: [-71.8102, -71.8067],
      range: [-71.81035, -71.80685],

      // range: [-71.8102, -71.8068],

      showgrid: false,
      visible: false,
      showticklabels: false,
    },
    yaxis: {
      // range: [42.2733, 42.2752],
      range: [42.27315, 42.27505],

      showgrid: false,
      visible: false,
      showticklabels: false,
    },
    paper_bgcolor: `rgba(0, 0, 0, 0)`,
    plot_bgcolor: `rgba(0, 0, 0, 0)`,
    width: 690,
    height: 575,
  };

Plotly.newPlot("myDiv", data, layout);

myPlot.on("plotly_click", function (data) {
  // console.log(data.points[i].pointNumber);
  // alert("You clicked this Plotly chart!");
  x = data.points[0].x;
  y = data.points[0].y;
  send_ros_message(x, y);
});

function send_ros_message(x, y) {
  var ros = new ROSLIB.Ros({
    url: "ws://130.215.13.116:9090",
  });

  ros.on("connection", function () {
    console.log("Connected to websocket server.");
  });

  ros.on("error", function (error) {
    console.log("Error connecting to websocket server: ", error);
  });

  ros.on("close", function () {
    console.log("Connection to websocket server closed.");
  });

  // Publishing a Topic
  // ------------------

  var goal = new ROSLIB.Topic({
    ros: ros,
    name: "/goal",
    messageType: "geometry_msgs/Point",
  });

  var point = new ROSLIB.Message({
    x: x,
    y: y,
    z: 0,
  });

  console.log("Publishing goal");
  goal.publish(point);
}

function send_start() {
  var ros = new ROSLIB.Ros({
    url: "ws://130.215.13.116:9090",
  });

  ros.on("connection", function () {
    console.log("Connected to websocket server.");
  });

  ros.on("error", function (error) {
    console.log("Error connecting to websocket server: ", error);
  });

  ros.on("close", function () {
    console.log("Connection to websocket server closed.");
  });

  // Publishing a Topic
  // ------------------

  var drive = new ROSLIB.Topic({
    ros: ros,
    name: "/robotStatus",
    messageType: "std_msgs/String",
  });

  var status = new ROSLIB.Message({
    data: "drive",
  });

  console.log("Publishing goal");
  drive.publish(status);
}

function send_stop() {
  var ros = new ROSLIB.Ros({
    url: "ws://130.215.13.116:9090",
  });

  ros.on("connection", function () {
    console.log("Connected to websocket server.");
  });

  ros.on("error", function (error) {
    console.log("Error connecting to websocket server: ", error);
  });

  ros.on("close", function () {
    console.log("Connection to websocket server closed.");
  });

  // Publishing a Topic
  // ------------------

  var drive = new ROSLIB.Topic({
    ros: ros,
    name: "/robotStatus",
    messageType: "std_msgs/String",
  });

  var status = new ROSLIB.Message({
    data: "stop",
  });

  console.log("Publishing goal");
  drive.publish(status);
}
// function send_ros_message(x, y) {
//   var ros = new ROSLIB.Ros({
//     url: "ws://192.168.0.205:9090",
//   });

//   ros.on("connection", function () {
//     console.log("Connected to websocket server.");
//   });

//   ros.on("error", function (error) {
//     console.log("Error connecting to websocket server: ", error);
//   });

//   ros.on("close", function () {
//     console.log("Connection to websocket server closed.");
//   });

//   // Publishing a Topic
//   // ------------------

//   var cmdVel = new ROSLIB.Topic({
//     ros: ros,
//     name: "/cmd_vel",
//     messageType: "geometry_msgs/Twist",
//   });

//   var twist = new ROSLIB.Message({
//     linear: {
//       x: 0.5,
//       y: 0.0,
//       z: 0.0,
//     },
//     angular: {
//       x: 0.3,
//       y: 0.0,
//       z: 0.0,
//     },
//   });

//   console.log("Publishing cmd_vel");
//   cmdVel.publish(twist);
// }
