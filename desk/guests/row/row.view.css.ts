namespace $ {

	$mol_style_define( $bog_sert_desk_guests_row, {

		flex: {
			direction: 'row',
			wrap: 'wrap',
		},
		align: {
			items: 'baseline',
		},
		gap: $mol_gap.text,
		padding: [ $mol_gap.text, $mol_gap.block ],
		background: {
			color: $mol_theme.card,
		},

		Ident: {
			flex: {
				grow: 1,
			},
			minWidth: '10rem',
			fontFamily: 'monospace',
		},

		Visits: {
			font: {
				size: '.85rem',
			},
			color: $mol_theme.shade,
		},

		Balance: {
			font: {
				weight: 'bold',
			},
			whiteSpace: 'nowrap',
		},

	} )

}
