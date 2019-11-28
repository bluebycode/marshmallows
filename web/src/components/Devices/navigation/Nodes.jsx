// @vrandkode
// Nodes graph representation using D3 has been developed before competition
import React from 'react';
import Configuration from '../../../services/configuration'
import * as d3 from 'd3';

class Nodes extends React.Component {
    constructor(props) {
        super(props)
        this.canvasStyle = {
            width: "60%",
            height: "30%",
            margin: "10px"
        }
        window.selectNode = (token) => {
            this.markAsSelected(token)
            this.props.onClickNode(token)
        }
    }

    componentWillMount() {
        Promise.all([
            d3.json(Configuration.brokerAddress("/nodos.json"))
            ]).then( ([data]) => {
                this.setState({
                    data
                });
            }).catch(err => console.log('Error loading or parsing data.'))
    }

    markAsSelected(token){
        this.state.data.nodes.forEach((node)=> {
            if (node.id === token){
                node.selected = true
            }else{
                node.selected = false
            }
        })
    }

    componentDidUpdate() {
        d3.selectAll("svg").remove();

        this.data = this.state.data;
        this.svg = {}
        this.simulation = {}

        this.width = 200;
        this.height = 100;

        this.tree = {
            nodes: {},
            links: {},
            texts: {}
        }

        this.drag(this.draw())
    }

    
    tick() {
        
        const tree = this.tree;
        if (!tree) {
            return
        }
        tree.nodes
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        tree.links
            .attr("x1", d => {
                if (!d.source.x) return 0;
                return d.source.x
            })
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        tree.texts
            .attr("x", d => {
                return d.group === 1 ? d.x + 2: d.x - 6;
            })
            .attr("y",  d => {
                return d.group === 1 ? d.y - 2: d.y + 1;
            })
    }

    drag(){
        function dragstarted(d) {
            if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        
        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }
        
        function dragended(d) {
            if (!d3.event.active) this.simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
        
        return d3.drag()
            .on("start", dragstarted.bind(this))
            .on("drag", dragged.bind(this))
            .on("end", dragended.bind(this));
    }

    
    draw(){
        const width = this.width;
        const height = this.height;
        const dist = (d) => d.distance ? d.distance: 40;
        const linked = d3.forceLink(this.data.links).distance(dist).id(d => d.id)
        this.simulation = d3.forceSimulation(this.data.nodes)
            .force("link", linked)
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(this.width / 2, height / 2));
    
        const svg = d3.select("#canvas").append("svg")
            .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
            .attr("viewBox", [0, 0, width, height])
    
        const link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
                .data(this.data.links)
            .join("line")
                .attr("id", d => "link-" + d.index)
                .attr("tooltip", d => d.source.id + "-" + d.target.id)
                .attr("stroke-width", d => Math.sqrt(d.value));
    
        function color(d){
            const scale = d3.scaleOrdinal(d3.schemeCategory10);
            return d => scale(d.group);
        }
    
        function isroot(d){
            return d.group === 1
        }
    
        const node = svg.append("g")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
                .data(this.data.nodes)
            .join("circle")
                .attr("id", d => "node-" + d.index)
                .attr("tooltip", d => d.id)
                .attr("r", d => isroot(d) ? 10 : 4.5)
                .attr("fill", d => d.selected ? "#2196F3" : (isroot(d) ? "#fff" : color(d)))
                .attr("stroke", d => isroot(d) ? "#000" : null)
                .call(this.drag());
    
        node.append("title")
            .text(d => d.id);
     
        const text = svg.append("g")
            .attr("stroke", "#000")
            .attr("stroke-width", 0)
            .selectAll("text")
                .data(this.data.nodes)
            .enter()
                .append("text")
                    .attr("onclick", (d) => d.group > 1 ? "selectNode('"+d.id+"')": "console.log('"+d.id+"')")
                    .attr("dx", 12)
                    .attr("dy", ".35em")
                    .attr("style",  (d) => d.group === 1 ? 
                        "font-family: 'Roboto', sans-serif;font-size: 8px;color:black !important;":
                        "font-family: 'Roboto', sans-serif;font-size: 6px;color:gray !important;")
                    .text(function(d) { return d.id });
    
        this.tree =  {
            nodes: node,
            links: link,
            texts: text
        }
       
        this.simulation.on("tick", this.tick.bind(this));
        this.svg = svg;
    }

    
    render() {
        return (
            <div id="canvas" style={this.canvasStyle}>
            </div>
        )
    }   
}
export default Nodes;