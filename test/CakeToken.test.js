const { assert } = require("chai");

const EvtToken = artifacts.require('EvtToken');

contract('EvtToken', ([alice, bob, carol, dev, minter]) => {
    beforeEach(async () => {
        this.evt = await EvtToken.new({ from: minter });
    });


    it('mint', async () => {
        await this.evt.mint(alice, 1000, { from: minter });
        assert.equal((await this.evt.balanceOf(alice)).toString(), '1000');
    })
});
