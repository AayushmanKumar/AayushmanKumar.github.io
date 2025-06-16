// Class representing a grid item
class GridItem {
    constructor(content, widthUnits, heightUnits, draggable, parentStyles) {
        this.content = content;
        this.widthUnits = widthUnits;
        this.heightUnits = heightUnits;
        this.draggable = draggable;
        this.parentStyles = parentStyles;

        // God knows how this works
        /*
        if (this.widthUnits > 1) {
            this.widthUnits += (this.widthUnits - 1) * 0.05;
        }

        if (this.heightUnits > 1) {
            this.heightUnits += (this.heightUnits - 1) * 0.05
        }*/
    }

    // Create a grid item element with specified unit size
    createElement(unitSize, gutter) {
        const width = (this.widthUnits * unitSize) + (gutter * Math.ceil(this.widthUnits - 1));
        const height = (this.heightUnits * unitSize) + (gutter * Math.ceil(this.heightUnits - 1));

        const el = document.createElement('div');
        el.className = 'grid-item';
        el.innerHTML = this.content;
        el.setAttribute('style', this.parentStyles);
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        return el;
    }
}

// Class representing the grid
class Grid {
    constructor(containerId, itemsPerRow, gutter) {
        this.$container = $(`#${containerId}`);
        this.itemsPerRow = itemsPerRow;
        this.gutter = gutter;
        this.items = [];
        this.packeryInstance = null;
    }

    // Calculate the unit size based on the container width and number of items per row
    calculateUnitSize() {
        const containerWidth = this.$container.width();
        return Math.floor((containerWidth - (this.gutter * this.itemsPerRow + 1)) / this.itemsPerRow);
    }

    // Render the grid
    render() {
        this.unrender();
        const unitSize = this.calculateUnitSize();

        this.$container.empty(); // Clear existing items

        // Append each item to the container
        this.items.forEach(item => {
            if (item.widthUnits > this.itemsPerRow) {
                item.heightUnits = Math.floor((item.widthUnits * item.heightUnits) / this.itemsPerRow);
                item.widthUnits = this.itemsPerRow;
            }
            this.$container.append(item.createElement(unitSize, this.gutter));
        });

        // Initialize Packery
        this.packeryInstance = this.$container.packery({
            itemSelector: '.grid-item',
            gutter: this.gutter,
            columnWidth: unitSize
        });

        // Make all items draggable using Draggabilly
        this.packeryInstance.find('.grid-item').each((_, gridItem) => {
            // if (!gridItem.draggable) {
            //     return;
            // }
            const draggie = new Draggabilly(gridItem);
            this.packeryInstance.packery('bindDraggabillyEvents', draggie);

            // Re-render the grid on drop
            draggie.on('dragEnd', () => {
                this.$container.packery({});
            });
        });
    }

    // Unrender the grid and unbind everything
    unrender() {
        if (this.packeryInstance) {
            this.packeryInstance.packery('destroy');
            this.$container.empty();
            this.packeryInstance = null;
        }
    }

    // Append a new item to the grid
    appendItem(item) {
        this.items.push(item);
        this.render();
    }
}