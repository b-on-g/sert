namespace $ {

	$mol_style_define( $bog_sert_desk_crew_row, {

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

		Title: {
			font: {
				weight: 'bold',
			},
		},

		Lord: {
			flex: {
				grow: 1,
			},
			minWidth: '8rem',
			fontFamily: 'monospace',
			font: {
				size: '.8rem',
			},
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
