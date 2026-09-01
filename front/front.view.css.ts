namespace $ {

	$mol_style_define( $bog_sert_front, {

		flex: {
			direction: 'column',
		},
		gap: $mol_gap.block,
		padding: $mol_gap.block,
		maxWidth: '32rem',
		width: '100%',
		margin: {
			left: 'auto',
			right: 'auto',
		},

		Head: {
			flex: {
				direction: 'column',
			},
			gap: '.25rem',
		},

		Name: {
			font: {
				size: '1.5rem',
				weight: 'bold',
			},
		},

		Note: {
			color: $mol_theme.shade,
			whiteSpace: 'pre-wrap',
		},

		Join: {
			alignSelf: 'flex-start',
		},

		Work: {
			alignSelf: 'flex-start',
		},

		Foot: {
			font: {
				size: '.85rem',
			},
			color: $mol_theme.shade,
		},

	} )

}
