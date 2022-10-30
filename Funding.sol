// SPDX-License-Identifier:UNLICENSED

pragma solidity ^0.8.0;

contract Funding{

    // structure for Each Campaign
    struct Campaign{
        uint id;  //id for every campaign
        address payable reciever; // eth addresss of reciever (payable bcoz transfering eth to this account)
        address donor; // eth address of donor
        string name; 
        string description;
        uint fundingGoal; // amount to be donated
        uint raisedFunds; // fundaingGoals - fundingDonated
        bool completed; // if completed no display for that purpose
    }

    uint public campaignCount; // to update id in campaign and to map in react
    Campaign[] public campaigns; // dictionary maps int => each campaign

    event campaignAdded(
        uint id,
        address payable reciever,
        string name,
        string description,
        uint fundingGoal,
        uint raisedFunds,
        bool completed
    );

    event campaignEnded(
        uint id,
        address payable reciever,
        address donor,
        string name,
        string description,
        uint fundingGoal,
        uint raisedFunds,
        bool completed
    );

    function createCampaign(
        string memory name,
        string memory description,
        uint fundingGoal
    ) public {
        require(bytes(name).length > 0);
        require(bytes(description).length > 0);
        require(fundingGoal > 0);

        campaignCount = campaignCount + 1;

        campaigns.push(Campaign(campaignCount,
        payable(msg.sender),
        address(0),
        name,
        description,
        fundingGoal,
        0,
        false
        ));

        //display create campaign on website using emit to event
        emit campaignAdded(
            campaignCount,
            payable(msg.sender), //older version support msg.sender
            name,
            description,
            fundingGoal,
            0,
            false
        );
    }

    function donate(uint id) public payable{

        require(campaigns[id].reciever != msg.sender);
        require(campaigns[id].completed == false);

        payable(campaigns[id].reciever).transfer(msg.value);
        campaigns[id].donor = msg.sender;
        campaigns[id].raisedFunds = msg.value;
        campaigns[id].completed = true;

        //mapping again changes to particular id

        // display ended campaigns in website we use emit
        emit campaignEnded(
            id,
            campaigns[id].reciever,
            msg.sender,
            campaigns[id].name,
            campaigns[id].description,
            campaigns[id].fundingGoal,
            campaigns[id].raisedFunds,
            campaigns[id].completed
        );
    }
}