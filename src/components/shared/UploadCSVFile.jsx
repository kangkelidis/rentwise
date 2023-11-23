'use client'

import { useState } from "react";

export default function UploadCSVFile({ action }) {
	const [file, setFile] = useState()

	function handleChange(file) {
		const reader = new FileReader()
		reader.onload = (function(f) {
            return function(e) {
				setFile(e.target.result)
            };
        })(file);
		reader.readAsText(file)
	}

	function handleSubmit(e) {
		e.preventDefault()
		action(file)
	}

	return (
		<form onSubmit={handleSubmit}>
			<label>Upload csv file</label>
			<input type='text'></input>
			<input
				type='file'
				accept='.csv'
				multiple={false}
				name='file'
				onChange={(e) => handleChange(e.target.files[0])}
			/>
			<button type='submit'>Generate</button>
		</form>
	)
}
