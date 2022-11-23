const fields = [{
    id: 'firstName',
    optional: false,
    displayName: 'First Name',
    description: 'The given name of the user',
    multiValue: false
}, {
    id: 'lastName',
    optional: false,
    displayName: 'Last Name',
    description: 'The surname of the user',
    multiValue: false
}, {
    id: 'displayName',
    optional: true,
    displayName: 'Display Name',
    description: 'The display name of the user',
    multiValue: false
}, {
    id: 'email',
    optional: false,
    displayName: 'E-Mail Address',
    description: 'The e-mail address of the user',
    multiValue: false
},{
    id: 'mobilePhone',
    optional: true,
    displayName: 'Mobile Phone',
    description: 'The mobile phone of the user',
    multiValue: false
}, {
    id: 'groups',
    optional: true,
    displayName: 'Groups',
    description: 'Group memberships of the user',
    multiValue: true
}];

class ProfileMapper {
    constructor(localProfile) {
        this.localProfile = localProfile;
        this.metadata = fields;

    }

    getClaims() {
        const claims = {};

        this.metadata.forEach((entry) => {
            if (entry.id in this.localProfile) {
                const key = entry.id;

                let value = this.localProfile[entry.id];
                if (entry.multiValue) {
                    value = value.split(',');
                }

                claims[key] = value;
            }
        });

        return Object.keys(claims).length && claims;
    }

    getNameIdentifier() {
        return {
            nameIdentifier: this.localProfile.userName,
            nameIdentifierFormat: this.localProfile.nameIdFormat,
            nameIdentifierNameQualifier: this.localProfile.nameIdNameQualifier,
            nameIdentifierSPNameQualifier: this.localProfile.nameIdSPNameQualifier,
            nameIdentifierSPProvidedID: this.localProfile.nameIdSPProvidedID
        };
    }
}

module.exports = ProfileMapper;