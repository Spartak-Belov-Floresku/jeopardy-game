describe('Testing block of functions shufflArray(), getCategoryIds(), getCategory(), and fillTable()', function(){

    it('if shufflArray() returns array and random array numbers and only six elements in array', function () {
        expect(shufflArray([1,2,3,4,5,6,7,8,9])).toBeInstanceOf(Array);
            expect(shufflArray([1,2,3,4,5,6,7,8,9])).not.toEqual([1,2,3,4,5,6,7,8,9]);
                expect(shufflArray([1,2,3,4,5,6,7,8,9]).length).toEqual(6);
    });

    it('if getCategoryIds() returns an array of six ids from server', async function(){
        let arr = await getCategoryIds()
            expect(arr).toBeInstanceOf(Array);
                expect(arr.length).toEqual(6);
    });

    it('if getCategory() returns an Object with proparty title and clues array 5 elemets from server', async function(){
        let obj = await getCategory(1115)
            expect(obj).toBeInstanceOf(Object);
                expect(obj.title).toBeTruthy();
                    expect(obj.clues.length).toEqual(5);
    });

    it('if fillTable() fill out the table with elements', async function(){
        setTimeout(async function(){
            categories = [];
                $('#game').empty();
                    await fillTable();
        }, 1000);
        expect($('#game').length).not.toEqual(0);
    });

});