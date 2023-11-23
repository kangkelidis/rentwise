
export default function UploadCSVFile(props) {
	// const [file, setFile] = useState()

    async function Generate(formData) {
        'use server'
        console.log(formData);
    }

	return (
		<form action={Generate}>
			<label>Upload csv file</label>
			<input
				type='file'
				accept='.csv'
				multiple={false}
				// onChange={(e) => setFile(e.target.files[0])}
			/>
            <button type="submit">Generate</button>
		</form>
	)
}
