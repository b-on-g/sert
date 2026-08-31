namespace $ {

	$mol_style_define( $bog_sert_desk, {

		flex: {
			direction: 'column',
		},
		gap: $mol_gap.block,
		padding: $mol_gap.block,
		maxWidth: '42rem',
		width: '100%',
		margin: {
			left: 'auto',
			right: 'auto',
		},

		Shop_block: {
			flex: {
				direction: 'column',
			},
			gap: $mol_gap.text,
			padding: $mol_gap.block,
			background: {
				color: $mol_theme.card,
			},
			border: {
				radius: $mol_gap.round,
			},
		},

		Issue_block: {
			flex: {
				direction: 'column',
			},
			gap: $mol_gap.text,
			padding: $mol_gap.block,
			background: {
				color: $mol_theme.card,
			},
			border: {
				radius: $mol_gap.round,
			},
		},

		Last_block: {
			flex: {
				direction: 'column',
			},
			gap: $mol_gap.text,
		},

		List_block: {
			flex: {
				direction: 'column',
			},
			gap: $mol_gap.text,
		},

		Shop_title: {
			font: {
				size: '1.1rem',
				weight: 'bold',
			},
		},

		Issue_title: {
			font: {
				size: '1.1rem',
				weight: 'bold',
			},
		},

		Last_title: {
			font: {
				size: '1.1rem',
				weight: 'bold',
			},
		},

		List_title: {
			font: {
				size: '1.1rem',
				weight: 'bold',
			},
		},

		Issue: {
			alignSelf: 'flex-start',
			margin: {
				top: $mol_gap.text,
			},
		},

		Last_card: {
			padding: 0,
		},

		List: {
			flex: {
				direction: 'column',
			},
			gap: '1px',
		},

	} )

}
