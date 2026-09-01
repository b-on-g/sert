namespace $ {

	$mol_style_define( $bog_sert_desk_certs_row, {

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

		Gift: {
			flex: {
				grow: 1,
			},
			minWidth: '10rem',
			font: {
				weight: 'bold',
			},
		},

		Whom: {
			color: $mol_theme.shade,
		},

		State: {
			font: {
				size: '.85rem',
			},
			color: $mol_theme.shade,
			whiteSpace: 'nowrap',
		},

	} )

}
