$(document).ready(function() {
    // Function to determine the number of items per row based on window width
    function getItemsPerRow() {
        const width = $(window).width();
        if (width <= 600) {
            return 2;
        } else if (width <= 768) {
            return 4;
        } else if (width <= 992) {
            return 6;
        } else if (width <= 1100) {
            return 8;
        } else {
            return 10;
        }
    }

    // Initialize the grid with the calculated items per row and a gutter width of 5
    let grid = new Grid('grid', getItemsPerRow(), 15);

    // Create grid items from bentoItems and append them to the grid
    bentoItems.forEach(item => {
        grid.appendItem(item);
    });

    // Render the grid
    grid.render();

    // Re-render the grid on window resize
    $(window).resize(function() {
        const items = grid.items; // get current items
        grid = new Grid('grid', getItemsPerRow(), 15); // update items per row
        items.forEach(item => {
            grid.appendItem(item);
        });
        grid.render();
    });
});
