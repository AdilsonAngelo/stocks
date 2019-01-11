// AVKEY: VS1Q0W7ZFJHF53Z4
String.prototype.replaceAll = function (search, replacement) {
	return this.split(search).join(replacement);
}

var stocks;

$.ajax('https://fundamentusapi.herokuapp.com/', {
	type: 'GET',
	async: true,
})
	.then(res => {
		stocks = [];

		for (let s in res) {
			if (res.hasOwnProperty(s)) {
				let stock = res[s];
				stock.tick = s;
				stocks.push(stock);
			}
		}

		for (let s of stocks) {
			for (let key in s) {
				if (s.hasOwnProperty(key)) {
					if (key != 'tick') s[key] = parseFloat(s[key].replaceAll('.', '').replace(',', '.'));
				}
			}
		}

		stocks = stocks.filter(s => s['Liq.2m.'] > 1e8);
		stocks.sort((a, b) => a.ROIC > b.ROIC ? -1 : (a.ROIC < b.ROIC ? 1 : 0));

		let i = 1;
		for (let s of stocks) {
			s.greenblatt = i;
			i++;
		}

		stocks.sort((a, b) => a['EV/EBIT'] < b['EV/EBIT'] ? -1 : (a['EV/EBIT'] > b['EV/EBIT'] ? 1 : 0));

		i = 1;
		for (let s of stocks) {
			s.greenblatt += i;
			i++;
		}

		stocks.sort((a, b) => a.greenblatt < b.greenblatt ? -1 : (a.greenblatt > b.greenblatt ? 1 : 0));

		i = 1
		for (let s of stocks) {
			$('#result tbody').append(
				"<tr>" +
				"<td>" + i + "</td>" +
				"<td>" + s.tick + "</td>" +
				"<td>R$ " + real.format(s.cotacao) + "</td>" +
				"<td>" + s['P/L'] + "</td>" +
				"<td>" + s.DY + "% </td>" +
				"<td>" + s.ROIC + "% </td>" +
				"<td>" + s.ROE + "% </td>" +
				"<td>" + real.format(s['Pat.Liq']) + "</td>" +
				"<td>" + s['EV/EBIT'] + "</td>" +
				"<td>" + real.format(s['Liq.2m.']) + "</td>" +
				"<td>" + s.greenblatt + "</td>" +
				"</tr>"
			);
			i++;
		}

		$('table').DataTable({
			responsive: true
		});
	})
	.catch(err => console.error(err));

var real = new Intl.NumberFormat('pt-BR', {
	// style: 'currency',
	currency: 'BRL',
	minimumFractionDigits: 2,
});