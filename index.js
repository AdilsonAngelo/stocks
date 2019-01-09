console.log($('#result'));

var stocks;

// AVKEY: VS1Q0W7ZFJHF53Z4

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

		console.log(stocks);


		for (let s of stocks) {
			for (let key in s) {
				if (s.hasOwnProperty(key)) {
					if (key != 'tick') s[key] = parseFloat(s[key].replace('.', '').replace(',', '.'));
				}
			}
		}

		stocks.sort((a, b) => a.ROIC < b.ROIC ? -1 : (a.ROIC > b.ROIC ? 1 : 0));

		let i = 0;
		for (let s of stocks) {
			s.greenblatt = i;
			i++;
		}

		stocks.sort((a, b) => a['EV/EBIT'] > b['EV/EBIT'] ? -1 : (a['EV/EBIT'] < b['EV/EBIT'] ? 1 : 0));

		i = 0;
		for (let s of stocks) {
			s.greenblatt += i;
			i++;
		}

		stocks.sort((a, b) => a.greenblatt > b.greenblatt ? -1 : (a.greenblatt < b.greenblatt ? 1 : 0));

		i = 0
		for (let s of stocks) {
			$('#result tbody').append(
				"<tr>" +
				"<td>" + i + "</td>" +
				"<td>" + s.tick + "</td>" +
				"<td>" + s.cotacao + "</td>" +
				"<td>" + s['P/L'] + "</td>" +
				"<td>" + s.DY + "</td>" +
				"<td>" + s.ROIC + "% </td>" +
				"<td>" + s.ROE + "% </td>" +
				"<td>" + s['Pat.Liq'] + "</td>" +
				"<td>" + s['EV/EBIT'] + "% </td>" +
				"<td>" + s.greenblatt + "</td>" +
				"</tr>"
			);
			i++;
		}

		$('table').DataTable();
	})
	.catch(err => console.error(err));