// AVKEY: VS1Q0W7ZFJHF53Z4
String.prototype.replaceAll = function (search, replacement) {
	return this.split(search).join(replacement);
}

var colors = []

// 'cotacao'
// 'P/L'
// 'P/VP'
// 'PSR'
// 'DY'
// 'P/Ativo'
// 'P/Cap.Giro'
// 'P/EBIT'
// 'P/Ativ.Circ.Liq.'
// 'EV/EBIT'
// 'Mrg.EBIT'
// 'Mrg.Liq.'
// 'Liq.Corr.'
// 'ROIC'
// 'ROE'
// 'Liq.2m.'
// 'PL'
// 'Div.Brut/Pat.'
// 'Cresc.5a'

var stocks;

var table;

$.ajax('https://fundamentusapi.herokuapp.com/', {
	type: 'GET',
	async: true,
}).then(res => {
	stocks = [];

	for (let s in res) {
		if (res.hasOwnProperty(s)) {
			let stock = res[s];
			stock.tick = s;
			stocks.push(stock);
		}
	}

	for (let s of stocks)
		for (let key in s)
			if (s.hasOwnProperty(key))
				if (key != 'tick') s[key] = parseFloat(s[key].replaceAll('.', '').replace(',', '.')), s.greenblatt = 0;

	stocks = Array.from(new Set(stocks.map(s => s.tick.substr(0, 4))))
		.map(tick => stocks.find(s => s.tick.substr(0, 4) === tick));

	stocks = stocks
		.filter(s => s['P/L'] > 0)
		.filter(s => s['P/L'] <= 20)
		.filter(s => s['P/VP'] >= 0)
		.filter(s => s['P/VP'] <= 20)
		// .filter(s => s['ROE'] > 0)
		.filter(s => s['Liq.Corr.'] >= 1)
		// .filter(s => s['Mrg.EBIT'] > 0)
		.filter(s => s['EV/EBIT'] > 0.00001)
		.filter(s => s['DY'] > 0.00001)
		.filter(s => s['Cresc.5a'] >= 4)
		.filter(s => s['Liq.2m.'] > 1e6)
		;

	stocks.sort((a, b) => a.ROIC < b.ROIC ? -1 : (a.ROIC > b.ROIC ? 1 : 0));

	incrementGreenblatt(stocks);

	stocks.sort((a, b) => a['EV/EBIT'] > b['EV/EBIT'] ? -1 : (a['EV/EBIT'] < b['EV/EBIT'] ? 1 : 0));

	incrementGreenblatt(stocks);

	stocks.sort((a, b) => a.greenblatt > b.greenblatt ? -1 : (a.greenblatt < b.greenblatt ? 1 : 0));

	i = 1
	for (let s of stocks) {
		$('#result tbody').append(
			"<tr>" +
			"<td>" + i + "</td>" +
			"<td>" + s.tick + "</td>" +
			"<td>R$ " + real.format(s.cotacao) + "</td>" +
			"<td>" + s['P/L'] + "</td>" +
			"<td>" + s['P/VP'] + "</td>" +
			"<td>" + s.DY + " %</td>" +
			"<td>" + s.ROIC + " %</td>" +
			"<td>" + s.ROE + " %</td>" +
			"<td>" + real.format(s['PL']) + "</td>" +
			"<td>" + s['EV/EBIT'] + "</td>" +
			// "<td>" + s['Cresc.5a'] + " %</td>" +
			"<td>" + s['Liq.Corr.'] + "</td>" +
			"<td>" + s.greenblatt + "</td>" +
			"</tr>"
		);
		i++;
	}

	table = $('#result').DataTable({
		responsive: true,
		fixedHeader: true,
		keys: true,
		select: true,
	});

}).catch(err => console.error(err));

var real = new Intl.NumberFormat('pt-BR', {
	// style: 'currency',
	currency: 'BRL',
	minimumFractionDigits: 2,
});

function incrementGreenblatt(stocks) {
	let i = 1;
	for (let s of stocks) {
		s.greenblatt += i;
		i++;
	}
}