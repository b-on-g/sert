namespace $ {

	/**
	 * Многострочное поле — это `$mol_string` в оболочке `<textarea>`.
	 *
	 * Готовый `$mol_textarea` не подошёл: он редактор кода и красит знаки
	 * препинания в поздравлении. А `$mol_textarea_edit` живёт только внутри него,
	 * потому что его стили делают поле прозрачным и абсолютным.
	 */
	$mol_style_define( $bog_sert_area, {

		overflow: 'auto',
		resize: 'vertical',
		whiteSpace: 'pre-wrap',
		textOverflow: 'clip',
		minHeight: '4.5rem',

	} )

}
