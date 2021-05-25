import './index.css';
import Chart from 'chart.js/auto';

function exp(x){
	return Math.exp(x);
}

function sin(x){
	return Math.sin(x);
}

function bisection(f, a, b, precision){
	while(Math.abs(b - a) > precision){
		let m = (a + b) / 2;
		let f_a = f(a);
		let f_b = f(b);
		let f_m = f(m);

		if(f_a == 0){
			return a;
		} 

		if(f_b == 0){
			return b;
		} 

		if(f_m == 0){
			return m;
		} 

		if(f_a * f_m < 0){
			b = m;
		} else if(f_b * f_m < 0){
			a = m;
		} else{
			return false;
		}
	}

	return (a + b) / 2;
}

function newton(f, a, precision){
	let x0 = a;
	let f_x0 = f(x0);

	while(Math.abs(f_x0) > precision){
		let df = (f(x0 + precision) - f_x0) / precision;

		x0 -= f_x0 / df;
		f_x0 = f(x0);
	}

	return x0;
}

const data = {
	exp: {
		dataset: [],
		labels: [],
		chart: null,
	},
	sin: {
		dataset: [],
		labels: [],
		chart: null,
	},
	pulse: {
		dataset: [],
		labels: [],
		t: null,
		chart: null,
	},
	linear: {
		dataset: [],
		labels: [],
		chart: null,
	},
}

function calc(input, type){
	const divisions = 100;

	const output = {
		dataset: [],
		labels: [],
	};

	if(type == "exp"){
		let m = Math.log(input.dataset[1]) / (input.labels[1] - input.labels[0]);

		for(let i = input.labels[0] * divisions; i < input.labels[1] * divisions; i++){
			output.labels.push(i / divisions);
			output.dataset.push(Math.exp(m * i / divisions) / input.dataset[1]);
		}

		return output;
	}

	if(type == "sin"){
		output.dataset.push(input.dataset[0]);

		for(let i = input.labels[0]; i < input.labels[0] + 12; i++){
			let value = input.dataset[0] + Math.sin(i);
			output.dataset.push(value);

			output.labels.push(i);
		}

		return output;
	}

	if(type == "pulse"){
		for(let i = 0; i < 3; i++){
			output.dataset.push(input.dataset[0]);
			output.dataset.push(input.dataset[1]);
			output.dataset.push(input.dataset[1]);
			output.dataset.push(input.dataset[0]);

			output.labels.push(input.labels[0] + i * input.t);
			output.labels.push(input.labels[1] + i * input.t);
			output.labels.push(input.labels[2] + i * input.t);
			output.labels.push(input.labels[3] + i * input.t);
		}

		return output;
	}

	return input;
}

function updateChart(type){
	//chart.data.labels = [0, 1, 2, 3, 4, 5, 6];

	const chart = data[type].chart;

	chart.canvas.classList.toggle("hidden");

	setTimeout(() => {
		chart.canvas.classList.toggle("opacity-0");
	}, 100);

	
	//chart.options.scales.y.min = 0;
	//chart.options.scales.y.max = 500;
	//chart.options.scales.x.min = 1;
	//chart.options.scales.x.max = 4;

	const output = calc(data[type], type);

	chart.data.labels = output.labels;
	chart.data.datasets = [{
		label: 'exp',
		tension: type == "linear" || type == "pulse" ? 0 : 0.4,
	    borderColor: 'rgb(250, 150, 0)',
		data: output.dataset,
		//data: [1, 10, 100, 1000, 10000, 100000, 1000000]
	}];

	chart.update();
}

function showFormFor(type){
	Array.from(document.getElementsByTagName("form")).forEach((el) => {
		el.classList.add("h-0");
		el.classList.remove("p-5");
	})

	document.querySelector(`#${type}`).classList.remove("h-0");
	document.querySelector(`#${type}`).classList.add("p-5");

	if(!data[type].chart){
		const canvas = document.querySelector(`#${type}-chart`);

		const chart = new Chart(canvas.getContext('2d'), {
			type: "line",
			data: {},
			options: {
				scales: {
					x: {
				        grid: {
				        	display: true,
							color: "#eee",
						},
						ticks: {
							color: "#aaa"
						}
			      	},
		         	y: {
				        grid: {
							color: "#aaa",
							borderColor: "#aaa"
						},
						ticks: {
							color: "#aaa"
						}
			      	}
			    }
			}
		});

		canvas.style = "display: hidden";

		data[type].chart = chart;

		addInputGroup(type);

		document.querySelector(`#pulse-t`).onchange = (e) => {
			data.pulse.t = e.target.value;
		};

		document.querySelector(`#linear-add`).onclick = () => {
			addInputGroup(type);
		};

		document.querySelector(`#${type}-submit`).onclick = () => {
			updateChart(type);
		};
	}
}

function createLabel(type, text, i){
	const label = document.createElement("label");

	label.for = `${type}-${text}-${i}`;
	label.innerHTML = `${text} <sub>${i}</sub> =`;
	label.classList = "ml-5 mr-2";

	return label;
}

function createInput(type, text, i){
	const input = document.createElement("input");

	input.type = "number";
	input.id = `${type}-${text}-${i}`;
	input.name = `${text}-${i}`;
	input.className = "bg-transparent border-2 rounded border-gray-500 focus:outline-none focus:border-gray-400";
	input.addEventListener('change', (e) => {
		data[type][text === "y" ? "dataset" : "labels"][i - 1] = (Number(e.target.value));
	});

	return input;
}

function addInputGroup(type){
	const container = document.querySelector(`#${type}-group`);

	const i = container.children.length + 1;

	let group = document.createElement("div");
	group.classList = "w-100 flex justify-around my-2";

	let yLabel = createLabel(type, "y", i);
	let yInput = createInput(type, "y", i);

	group.appendChild(yLabel);
	group.appendChild(yInput);

	let tInput = createInput(type, "t", i);
	let tLabel = createLabel(type, "t", i);

	group.appendChild(tLabel);
	group.appendChild(tInput);

	container.appendChild(group);

	group = document.createElement("div");
	group.classList = "w-100 flex justify-around my-2";

	if(type == "sin"){
		group.classList = "w-100 flex justify-center my-2";

		yLabel = createLabel(type, "y", i + 1);
		yInput = createInput(type, "y", i + 1);

		group.appendChild(yLabel);
		group.appendChild(yInput);

		container.appendChild(group);
	}

	if(type == "exp" || type == "pulse"){
		yLabel = createLabel(type, "y", i + 1);
		yInput = createInput(type, "y", i + 1);

		group.appendChild(yLabel);
		group.appendChild(yInput);

		tInput = createInput(type, "t", i + 1);
		tLabel = createLabel(type, "t", i + 1);

		group.appendChild(tLabel);
		group.appendChild(tInput);

		container.appendChild(group);
	}

	if(type == "pulse"){
		group = document.createElement("div");
		group.classList = "w-100 flex justify-around my-2";

		yLabel = createLabel(type, "t", i + 2);
		yInput = createInput(type, "t", i + 2);

		group.appendChild(yLabel);
		group.appendChild(yInput);

		tInput = createInput(type, "t", i + 3);
		tLabel = createLabel(type, "t", i + 3);

		group.appendChild(tLabel);
		group.appendChild(tInput);

		container.appendChild(group);
	}

	//document.getElementById(`${type}-y-${i}`)
}

const nav = document.querySelector('#nav');

nav.addEventListener("click", (e) => showFormFor(e.target.dataset.type))

const chart = document.querySelector('#chart');


