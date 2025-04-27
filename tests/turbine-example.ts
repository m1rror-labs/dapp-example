import * as anchor from "@coral-xyz/anchor";
import { Program, web3 } from "@coral-xyz/anchor";
import { expect } from "chai";
import { AnchorCounter } from "../target/types/anchor_counter";

describe("anchor-counter", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AnchorCounter as Program<AnchorCounter>;

  const signer = anchor.web3.Keypair.generate();
  const counter = new web3.PublicKey(
    "A6ttX3ak9Vp5qgUDSNUcbvYE3jT2G9yi6inFX7dQyQPP"
  );

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
      .initialize()
      .accounts({ counter: counter })
      .signers([signer])
      .rpc();

    const account = await program.account.counter.fetch(counter);
    expect(account.count.toNumber()).to.equal(0);
  });

  it("Incremented the count", async () => {
    const tx = await program.methods
      .increment()
      .accounts({ counter: counter, user: provider.wallet.publicKey })
      .rpc();

    const account = await program.account.counter.fetch(counter);
    console.log("account", counter.toBase58());
    expect(account.count.toNumber()).to.equal(1);
  });
});
