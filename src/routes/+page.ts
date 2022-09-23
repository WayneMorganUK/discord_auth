/** * @type {import('@sveltejs/kit').Load} */
export async function load({ locals }) {
    console.log('========page.load.locals==============', locals)
    return { ...locals }

}