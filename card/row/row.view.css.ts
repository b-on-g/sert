namespace $ {

	$mol_style_define( $bog_sert_card_row, {

		align: {
			items: 'baseline',
		},
		gap: $mol_gap.text,
		padding: [ $mol_gap.text, $mol_gap.block ],
		background: {
			color: $mol_theme.card,
		},

		Name: {
			flex: {
				grow: 1,
			},
		},

		Balance: {
			font: {
				weight: 'bold',
			},
			whiteSpace: 'nowrap',
		},

	} )

}
