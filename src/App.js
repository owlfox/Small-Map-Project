import * as React from 'react';
import * as d3 from 'd3';
import './App.css';
import m from './Assets/images/HYP_50_M_SR_W.jpg'
import Weather from './Assets/weather'


import Modal from './Components/Modal'
class App extends React.Component {
  
  canvas_width = 800;
  canvas_height = 600;
  canvas = null;
  img = null;
  
  state = {
    backdrop_show : false,
  }
  
  get2DXYfromCoordinate(lat, lon, width, height) {
    let x = (180+lon)*width/360;
    let y = (90-lat)*height/180;
    return [x, y]
  }

  onMouseMove = (e) => { 
    this.updateCanvas(e)
    
  }

  onMouseClick = (e) => {
    
    let rtn = this.updateCanvas(e)
    if(rtn) {
      
      this.setState({
        backdrop_show: true
      })
      let w = 400, h = 300;
      let dataset = rtn.properties.temperatures
      d3.select("#d3").select("*").remove()
      const svg = d3.select("#d3")
                  .append("text")
                  .text(`Location: ${rtn.properties.location}, lat,lon:${rtn.geometry.coordinates}`)
                  .attr("dy", "0em")
                  
      .append('svg')
      .attr('width', w)
      .attr('height',h)

    
    svg.selectAll("rect")
       .data(dataset)
       .enter()
       .append("rect")
       .attr("x", (d, i) => i * 30)
       .attr("y", (d, i) => h - 5 * d)
       .attr("width", 25)
       .attr("height", (d, i) => d * 5)
       .attr("fill", "navy");

    svg.append("text")
    .text(`Average Temperatures:`)
    .attr("dy", "1.2em");
    }
  }
  updateCanvas = (e) => {
    
    
    let y_mouse, x_mouse, i=0, c;
    const ctx = this.canvas.getContext("2d")
    // important: correct mouse position:
    
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // for demo
    ctx.drawImage(this.img, 0, 0,this.canvas.width,this.canvas.height)

    let featureIn = null;
    while(c = Weather.features[i++]) {
      
      let [lat, lon] = c.geometry.coordinates
      let [x, y] = this.get2DXYfromCoordinate(lat, lon, this.canvas.width, this.canvas.height)
  
      ctx.beginPath();
      ctx.rect(x-5, y-5, 10, 10);    
      
      // check if we hover it, fill red, if not fill it blue
      let isInRect = false
      if(e) {
        let rect = this.canvas.getBoundingClientRect();
        x_mouse = e.clientX - rect.left;
        y_mouse = e.clientY - rect.top;  
        isInRect = ctx.isPointInPath(x_mouse, y_mouse);
      }
      ctx.fillStyle = isInRect ? "red" : "blue";
      ctx.fill();
      if(isInRect) {
        
        featureIn = c
      }
    }
    return featureIn;
  }
  componentDidMount() {
    this.canvas = this.refs.map_canvas;
    this.img = this.refs.image;
    this.img.onload = () => {
      this.updateCanvas()
    }
    this.canvas.addEventListener('mousemove', this.onMouseMove, false);
    this.canvas.addEventListener('click', this.onMouseClick, false);
    
  }
  bdClosed = () => {
    this.setState({
      backdrop_show: false
    })
  }

  render() {
    return (
      <div>
        <Modal show={this.state.backdrop_show} clicked={this.bdClosed}>
          <div id="d3"></div>
        </Modal>
        <header>Small map project, visualizing weather</header>
        <canvas ref="map_canvas" width={this.canvas_width} height={this.canvas_height} />
        <img ref="image" alt="map" src={m} className="hidden" />
        
      </div>
    );
  }
}

export default App;