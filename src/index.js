
import { Network } from "vis-network/standalone";
import { interval } from 'rxjs';
import { tap, take } from 'rxjs/operators';
import './styles.css'


        const llamadas = {
            locales: 0,
            evento: 0
            }
    
            class Node{
    
            canalesDis;
            capacidad;
            ocupado;
            id;
    
            constructor(id, ocupado = 0, capacidad){
                this.canalesDis = 0;
                this.capacidad = capacidad ? 200: 250;
                this.ocupado = ocupado;
                this.id = id ? id: 2;
            }
            }
    
            const nodesC = [];
            const nodeEvent = new Node();
    
            for(let i = 0; i < 7; i++){
            if(i != 1)
                nodesC.push(new Node(i+1, Math.random() * 120));
            }
    
            const maxLocales = 10780;
            const maxEvento = 10000;
    
            const contador = document.querySelector('#contador') || document;
            const datos = document.querySelector('#datos') || document.body;
            const tabla = document.querySelector('#tables') || document.body;
            const events = document.querySelector('.movimientos') || document.body;
    
            const timer$ = interval(60).pipe( take(3601) );
    
            const startButton = document.querySelector('#start');
            // create an array with nodes
            var nodes = [
                { id: 1, value: 16, physics: false, label: "nodo 1", x: -500, y: 0 },
                { id: 2, value: 16, physics: false, label: "nodo 2", x: 0, y: 0 , color: { background: 'yellow' }},
                { id: 3, value: 16, physics: false, label: "nodo 3", x: 0, y: 300 },
                { id: 4, value: 16, physics: false, label: "nodo 4", x: 50, y: -100 },
                { id: 5, value: 16, physics: false, label: "nodo 5", x: -350, y: 200 },
                { id: 6, value: 16, physics: false, label: "nodo 6", x: -200, y: -100 },
                { id: 7, value: 16, physics: false, label: "nodo 7", x: 175, y: 0 },
            ];
    
            // create connections between people
            // value corresponds with the amount of contact between two people
            var edges = [
                // { from: 2, to: 8, value: 4 },
                { from: 2, to: 4, value: 6 },
                { from: 2, to: 3, value: 6 },
                { from: 3, to: 1, value: 6 },
                { from: 4, to: 6, value: 6 },
                { from: 6, to: 1, value: 6 },
                { from: 2, to: 5, value: 6 },
                { from: 5, to: 1, value: 6 },
                { from: 7, to: 3, value: 6 },
                { from: 7, to: 4, value: 6 },
            ];
    
            // Instantiate our network object.
            var container = document.getElementById("mynetwork") || document.body;
            var data = {
                nodes: nodes,
                edges: edges,
            };
            var options = {
                nodes: {
                shape: "dot",
                scaling: {
                    customScalingFunction: function (min, max, total, value) {
                    return value / total;
                    },
                    min: 5,
                    max: 150,
                },
                },
                physics:{
                    enabled: false,
                }
            };
            var network = new Network(container, data, options);
    
            const makeTable = () => nodesC.reduce( (prev, curr) => { 
                
            const por = Math.round((curr.ocupado /  curr.capacidad) * 100);
            return prev + `
            <tr>
                <th scope="row">${ curr.id }</th>
                <td style=" ${por > 90 ? `
                background-color: red;
                color: white;
                ` : `
                background-color: white;
                color: black;
                ` } ">${ por < 0 ? 0: por } %</td>
            </tr>
            `}, '' )
    
            startButton?.addEventListener('click', (event) => {
            timer$.pipe( tap( (res) => {
                const minutos = res % 60;
                contador.textContent = `${Math.floor(res/60) < 10? `0${Math.floor(res/60)}`: Math.floor(res/60)}:${Math.round(60*(minutos/100)) < 10 ? `0${Math.round(60*(minutos/100))}` : Math.round(60*(minutos/100))}`;
                }
            ) ).subscribe((res) => {
                let porcentaje = nodeEvent.ocupado /  nodeEvent.capacidad
                if(porcentaje > 100){
                const numRan = Math.random() * 6;
                const nodeAux = numRan > 4 ? 4 : numRan > 2 ? 5 : 3;
                nodesC[nodeAux - 1].ocupado = Math.random() * 5 > 1.9? nodesC[nodeAux - 1].ocupado + 1: nodesC[nodeAux - 1].ocupado - 1;
                const p = document.createElement('p');
                p.innerText = `Solicitando apoyo al nodo ${nodeAux}`;
                p.scrollTo( 0, p.scrollHeight);
                events.append(p); 
                }else{
                nodeEvent.ocupado =  Math.random() * 5 > 1.5? nodeEvent.ocupado + 30: nodeEvent.ocupado - 30;
                }
                datos.innerHTML = `
                <p> Porcentaje de la celda pricipal ocupada: ${ Math.floor(porcentaje) < 10? `0${Math.floor(porcentaje)}`: Math.floor(porcentaje) }% </p>
                `
                nodesC.forEach( node => node.ocupado = Math.random() * 5 > 2.5? node.ocupado + 1: node.ocupado - 1);
                tabla.innerHTML = `
                    <table class="table">
                    <thead>
                        <tr>
                        <th scope="col">Nodo</th>
                        <th scope="col"> Ocupabilidad </th>
                        </tr>
                    </thead>
                    <tbody>
                        ${ makeTable() }
                    </tbody>
                    </table>
                `
            });
            })