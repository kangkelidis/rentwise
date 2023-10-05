

export async function getCars() {
    return cars
  }

export async function getMakes() {
    const data = await fetch('https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/all-vehicles-model/records?group_by=make&order_by=count(make)%20DESC&limit=58')
    const result = await data.json();
    const makes = result.results.map(res => {
        return {label: res.make, value: res.make}
    })
    return makes
}

export async function getBaseModels(make) {
    const data = await fetch(`https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/all-vehicles-model/records?select=*&where=make%3D%27${make}%27%20&group_by=basemodel`)
    const result = await data.json();
    const basemodels = result.results.map(res => {
        return {label: res.basemodel, value: res.basemodel}
    })
    return basemodels

}