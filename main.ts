import { Construct } from 'constructs';

import {AzurermProvider, VirtualNetwork, ResourceGroup, AppServicePlan, Subnet, NetworkInterface, AppService} from "@cdktf/provider-azurerm";
import { App, TerraformStack } from 'cdktf';
 //from "./.gen/providers/azurerm"
class AzureAppInfra extends TerraformStack {
 constructor(scope: Construct, name: string) {
   super(scope, name);
new AzurermProvider(this, "AzureRm", {
     features: {}
   })
let rg = new ResourceGroup(this, "rg-example", {
     name: "proba1",
     location: "eastus"
   })
let vnet = new VirtualNetwork(this, "vnet-example", {
     name: "example-network",
     location: rg.location,
     addressSpace: ["10.0.0.0/16"],
     resourceGroupName: rg.name
})
let subnet = new Subnet(this, "subnet-example", {
     name: "example-subnet",
     resourceGroupName: rg.name,
     virtualNetworkName: vnet.name ,
     addressPrefixes: ["10.0.2.0/24"]
   })
new NetworkInterface(this, "ni-example", {
     name: "example-nic",
     resourceGroupName: rg.name,
     location: rg.location,
     ipConfiguration: [{
       name: "internal",
       subnetId: subnet.id,
       privateIpAddressAllocation: "Dynamic"
     }]
   })

   let appserviceplan = new AppServicePlan(this, "app-service-plan-test", {
      name: "AppServicePlan-proba",
      location: rg.location,
      resourceGroupName: rg.name,
      kind: "Linux",
      reserved: true,
      // Private endpoint required tier: PremiumP2 P2v2
      sku: {
        tier: "Free",
        size: "F1",
      },
    });
  
    new AppService(this, "app1-proba",
    {name: "app1-proba",
    location: rg.location,
    resourceGroupName: rg.name,
    appServicePlanId: appserviceplan.id,

  
    }
    
    );
  }
  
// new LinuxVirtualMachine(this, 'Web-Server', {
//      name: "Web-App-1",
//      resourceGroupName: rg.name,
//      adminUsername: "devhulk",
//      size: "Standard_F2",
//      location: rg.location,
//      networkInterfaceIds: [
//        network_interface.id
//      ],
//      osDisk: {
//        caching: "ReadWrite",
//        storageAccountType: "Standard_LRS"
//      },
//      sourceImageReference: {
//        publisher: "Canonical",
//        offer: "UbuntuServer",
//        sku: "16.04-LTS",
//        version: "latest"
//      },
//     // adminSshKey: [{username: "", publicKey: ""}]
// })
}
const app = new App();
new AzureAppInfra(app, 'cdk');
app.synth();