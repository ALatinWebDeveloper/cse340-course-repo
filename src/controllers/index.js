const showHomePage = async (req, res) => {
    const title = 'Home';

    await res.render('home', { title });
};

export { showHomePage };