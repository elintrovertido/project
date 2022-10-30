import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import User from './User';
import Funding from '../contracts/Funding.json';

function Navbar() {

    const [account, setAccount] = useState()
    const [balance, setBalance] = useState()
    const [api, setApi] = useState()
    const [contract,setContract] = useState()
    const [campaignCount,setCampaignCount] = useState(0)
    const [campaigns,setCampaigns] = useState([])
    const contractAbi = Funding.abi
    const contractAddress = Funding.networks['5777'].address
    

    // reloading web page
    const reload = () => {
        window.location.reload()
    }
    // connecting to brave wallet or metamask
    useEffect(() => {
        const connectWallet = async () => {
            if (window.ethereum) {
                window.web3 = new Web3(window.ethereum)
                setApi(window.web3)
                await window.ethereum.enable()
            } else if (window.web3) {
                window.web3 = new Web3(window.web3.currentProvider)
                setApi(window.web3)
            } else {
                alert("Install Metamask for donate and request donations")
            }
        }
        connectWallet()
    }, [])
    //check if accounts are changed
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', () => {
                reload()
            })
        }
    }, [])
    // fetching details from crpto wallet
    useEffect(() => {
        const getAccount = async () => {
            const accounts = await api.eth.getAccounts()
            setAccount(accounts[0])
        }
        const getBalance = async () => {
            const _balance = await api.eth.getBalance(account)
            setBalance(_balance / 1e18)
        }
        getAccount()
        getBalance()
    })
    // connecting to contract
    useEffect(()=>{
        const loadContract = async ()=>{
            if (contractAddress){
                const _contract = new api.eth.Contract(contractAbi,contractAddress)
                setContract(_contract)
            }else{
                alert("NO network")
            }
        }
        loadContract()

        const getCampaignCount = async ()=> {
            const _campaignCount = await contract.methods.campaignCount().call((err,res)=>{
                console.log(res)
            })
            setCampaignCount(_campaignCount)    
        }
        getCampaignCount()

        const createCampaign = async (name,description,fundingGoal)=>{
            contract.methods.createCampaign(name,description,fundingGoal).send({
                from : account
            })
        }
        // createCampaign("test1","testdesc1","10")

        const loadCampaigns = async ()=>{
            setCampaigns([])
            for(let i=0;i<campaignCount;i++){
                const campaign = await contract.methods.campaigns(i).call()
                setCampaigns(cur => [...cur,campaign] )
            }
        }
        loadCampaigns()

        const donateEth = async (index)=>{
            contract.methods.donate(index).send({
                from : account,
                value : campaigns[index].fundingGoal
            })
        }
        donateEth(0)



    },[account])
    console.log(campaigns)
    
    


    return (
        <>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">Zoro</a>

                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="#">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Donate</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Register</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">UserAccount</a>
                        </li>
                    </ul>                    
                </div>
            </nav>
            <User account={account} balance={balance} />
        </>
    )
}
export default Navbar;