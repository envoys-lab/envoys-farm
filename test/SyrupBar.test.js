const { advanceBlockTo } = require('@openzeppelin/test-helpers/src/time');
const { assert } = require('chai');
const EvtToken = artifacts.require('EvtToken');
const EnvoysBar = artifacts.require('EnvoysBar');

contract('EnvoysBar', ([alice, bob, carol, dev, minter]) => {
  beforeEach(async () => {
    this.evt = await EvtToken.new({ from: minter });
    this.evb = await EnvoysBar.new(this.evt.address, { from: minter });
  });

  it('mint', async () => {
    await this.evb.mint(alice, 1000, { from: minter });
    assert.equal((await this.evb.balanceOf(alice)).toString(), '1000');
  });

  it('burn', async () => {
    await advanceBlockTo('650');
    await this.evb.mint(alice, 1000, { from: minter });
    await this.evb.mint(bob, 1000, { from: minter });
    assert.equal((await this.evb.totalSupply()).toString(), '2000');
    await this.evb.burn(alice, 200, { from: minter });

    assert.equal((await this.evb.balanceOf(alice)).toString(), '800');
    assert.equal((await this.evb.totalSupply()).toString(), '1800');
  });

  it('safeEvtTransfer', async () => {
    assert.equal(
      (await this.evt.balanceOf(this.evb.address)).toString(),
      '0'
    );
    await this.evt.mint(this.evb.address, 1000, { from: minter });
    await this.evb.safeEvtTransfer(bob, 200, { from: minter });
    assert.equal((await this.evt.balanceOf(bob)).toString(), '200');
    assert.equal(
      (await this.evt.balanceOf(this.evb.address)).toString(),
      '800'
    );
    await this.evb.safeEvtTransfer(bob, 2000, { from: minter });
    assert.equal((await this.evt.balanceOf(bob)).toString(), '1000');
  });
});
