import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
  ItemBought as ItemBoughtEvent,
  ItemCanceled as ItemCanceledEvent,
  ItemListed as ItemListedEvent,
} from "../generated/Contract/Contract";
import {
  ItemListed,
  ActiveItem,
  ItemBought,
  ItemCanceled,
} from "../generated/schema";

export function handleItemListed(event: ItemListedEvent): void {
  let itemListedObj = ItemListed.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  let activeItemObj = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  if (!itemListedObj) {
    itemListedObj = new ItemListed(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }
  if (!activeItemObj) {
    activeItemObj = new ActiveItem(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }
  itemListedObj.seller = event.params.seller;
  activeItemObj.seller = event.params.seller;

  itemListedObj.nftAddress = event.params.nftAddress;
  activeItemObj.nftAddress = event.params.nftAddress;

  itemListedObj.tokenId = event.params.tokenId;
  activeItemObj.tokenId = event.params.tokenId;

  itemListedObj.price = event.params.price;
  activeItemObj.price = event.params.price;

  activeItemObj.buyer = Address.fromString(
    "0x0000000000000000000000000000000000000000"
  );

  itemListedObj.save();
  activeItemObj.save();
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
  let itemCanceledObj = ItemCanceled.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  let activeItemObj = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  if (!itemCanceledObj) {
    itemCanceledObj = new ItemCanceled(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }
  itemCanceledObj.seller = event.params.seller;
  itemCanceledObj.nftAddress = event.params.nftAddress;
  itemCanceledObj.tokenId = event.params.tokenId;
  activeItemObj!.buyer = Address.fromString(
    "0x000000000000000000000000000000000000dEaD"
  ); // to indicate that the item is not active anymore i.e. it is not listed for sale

  itemCanceledObj.save();
  activeItemObj!.save();
}

export function handleItemBought(event: ItemBoughtEvent): void {
  let itemBoughtObj = ItemBought.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  let activeItemObj = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  if (!itemBoughtObj) {
    itemBoughtObj = new ItemBought(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }
  itemBoughtObj.buyer = event.params.buyer;
  itemBoughtObj.nftAddress = event.params.nftAddress;
  itemBoughtObj.tokenId = event.params.tokenId;
  activeItemObj!.buyer = event.params.buyer;

  itemBoughtObj.save();
  activeItemObj!.save();
}

function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): string {
  return tokenId.toHexString() + nftAddress.toHexString();
}
