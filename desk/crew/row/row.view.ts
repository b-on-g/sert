namespace $.$$ {

	/** Строка бригады: кто, какой лорд, работает или уволен. */
	export class $bog_sert_desk_crew_row extends $.$bog_sert_desk_crew_row {

		override row_sub() {
			return [
				this.Title(),
				this.Lord(),
				... this.fired() ? [ this.State() ] : [ this.Fire() ],
			]
		}

	}

}
