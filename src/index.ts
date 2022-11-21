import './scss/main.scss';

const create = () => {
	const span = document.createElement('span');
	span.textContent = 'hello';
	span.style.background = 'green';
	return span;
};

document.body.append(create());
