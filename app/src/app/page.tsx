"use client";
import { ConnectWalletDialog } from "@/components/sol/connect-wallet-dialog";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { AnchorProvider, Program, web3 } from "@coral-xyz/anchor";
import { AnchorCounter } from "../../../target/types/anchor_counter";
import { idl } from "@/components/sol/idl";
import { Toaster, toast } from "sonner";

export declare const workspace: any;

export default function Home() {
  const { publicKey, wallet } = useWallet();
  const [count, setCount] = useState(0);
  const counter = new web3.PublicKey(
    "A6ttX3ak9Vp5qgUDSNUcbvYE3jT2G9yi6inFX7dQyQPP"
  );

  const getCount = async () => {
    const connection = new web3.Connection(process.env.NEXT_PUBLIC_RPC_URL!); // Replace with your RPC URL if needed
    const provider = new AnchorProvider(
      connection,
      // @ts-ignore
      wallet,
      AnchorProvider.defaultOptions()
    );

    // Initialize the program
    const program = new Program<AnchorCounter>(idl as any, provider);

    const account = await program.account.counter.fetch(counter);
    console.log("account", counter.toBase58());
    setCount(account.count.toNumber());
  };

  useEffect(() => {
    getCount();
  }, []);

  const handleClick = async () => {
    if (!publicKey || !wallet) {
      toast.error("Wallet not connected");
      return;
    }

    const connection = new web3.Connection(process.env.NEXT_PUBLIC_RPC_URL!); // Replace with your RPC URL if needed
    const provider = new AnchorProvider(
      connection,
      // @ts-ignore
      wallet.adapter,
      AnchorProvider.defaultOptions()
    );
    const program = new Program<AnchorCounter>(idl as any, provider);
    try {
      console.log("incrementing");
      const tx = await program.methods
        .increment()
        .accounts({ counter: counter, user: publicKey })
        .rpc();
      toast.success("Transaction successful");
      getCount();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <ConnectWalletDialog
        trigger={<Button>Connect Wallet</Button>}
        title="Connect Wallet"
        description="Connect your wallet to continue"
      />
      <div>
        <div>Your pubkey {publicKey?.toBase58()}</div>
        <div>Current Count {count}</div>
        <Button onClick={handleClick}>Incremenet Counter</Button>
      </div>
      <Toaster />
    </div>
  );
}
