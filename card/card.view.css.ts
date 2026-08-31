namespace $ {

	$mol_style_define( $bog_sert_card, {

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

		Sheet: {
			flex: {
				direction: 'column',
			},
			gap: $mol_gap.text,
			padding: [ $mol_gap.block, $mol_gap.block ],
			background: {
				color: $mol_theme.card,
			},
			border: {
				radius: $mol_gap.round,
			},
			boxShadow: `0 0 0 1px ${ $mol_theme.line }, 0 1.5rem 2.5rem -2rem ${ $mol_theme.shade }`,
			position: 'relative',
			overflow: 'hidden',

			// Полоса фирменного цвета по верхнему краю — единственное украшение,
			// которое не мешает читать и не требует картинок.
			'::before': {
				content: '""',
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				height: '4px',
				background: {
					image: [ [ `linear-gradient( 90deg, ${ $mol_theme.focus }, ${ $mol_theme.special } )` ] ],
				},
			},
		},

		Head: {
			flex: {
				direction: 'column',
			},
			gap: '.25rem',
			padding: {
				top: $mol_gap.text,
			},
		},

		Shop: {
			font: {
				size: '1.25rem',
				weight: 'bold',
			},
		},

		Kind: {
			font: {
				size: '.75rem',
			},
			letterSpacing: '.15em',
			textTransform: 'uppercase',
			color: $mol_theme.shade,
		},

		Gift: {
			font: {
				size: '2rem',
				weight: 'bold',
			},
			lineHeight: '1.2',
			padding: {
				top: $mol_gap.text,
				bottom: $mol_gap.text,
			},
		},

		Names: {
			flex: {
				direction: 'column',
			},
			gap: '.125rem',
			color: $mol_theme.shade,
		},

		Wish: {
			fontStyle: 'italic',
			padding: {
				top: $mol_gap.text,
				bottom: $mol_gap.text,
			},
			whiteSpace: 'pre-wrap',
		},

		Foot: {
			flex: {
				direction: 'column',
			},
			gap: '.125rem',
			padding: {
				top: $mol_gap.text,
			},
			border: {
				top: {
					width: '1px',
					style: 'solid',
					color: $mol_theme.line,
				},
			},
			font: {
				size: '.85rem',
			},
			color: $mol_theme.shade,
			whiteSpace: 'pre-wrap',
		},

		Stamp: {
			alignSelf: 'flex-start',
			margin: {
				top: $mol_gap.text,
			},
			padding: [ '.25rem', '.75rem' ],
			border: {
				width: '2px',
				style: 'solid',
				color: 'red',
				radius: $mol_gap.round,
			},
			color: 'red',
			font: {
				size: '.9rem',
				weight: 'bold',
			},
			letterSpacing: '.05em',
			textTransform: 'uppercase',
			transform: 'rotate(-3deg)',
		},

		Aside: {
			align: {
				items: 'center',
			},
			gap: $mol_gap.block,
			padding: [ 0, $mol_gap.text ],
		},

		Code: {
			width: '7rem',
			height: '7rem',
			flex: {
				grow: 0,
				shrink: 0,
			},
		},

		Ident: {
			flex: {
				direction: 'column',
			},
			gap: '.125rem',
			minWidth: 0,
		},

		Ident_label: {
			font: {
				size: '.75rem',
			},
			color: $mol_theme.shade,
		},

		Ident_value: {
			fontFamily: 'monospace',
			wordBreak: 'break-all',
		},

		Tools: {
			flexWrap: 'wrap',
			gap: $mol_gap.text,
			padding: [ 0, $mol_gap.text ],
		},

	} )

}
