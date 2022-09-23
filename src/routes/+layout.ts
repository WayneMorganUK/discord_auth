/** * @type {import('@sveltejs/kit').Load} */
export async function load({ locals }) {
    console.log('========layout.load.locals==============', locals)
    return { ...locals }

}