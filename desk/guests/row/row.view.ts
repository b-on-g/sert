namespace $.$$ {

	/** Строка гостя: номер карты, сколько раз обслужили, текущий баланс. */
	export class $bog_sert_desk_guests_row extends $.$bog_sert_desk_guests_row {

		ident() {
			return this.pass_uri()
		}

		visits_text() {
			const visits = this.visits()
			const last = this.last()
			return last ? `${ visits } операций, последняя ${ last }` : `${ visits } операций`
		}

		balance_text() {
			return `${ this.balance() } баллов`
		}

	}

}
