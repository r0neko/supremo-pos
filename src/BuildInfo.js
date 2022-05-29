const Build = {
    Major: 2,
    Minor: 79,
    Patch: 90
};

function IsProduction() {
    return process.env.NODE_ENV === "production";
}

const BuildString = `${Build.Major}.${Build.Minor}.${Build.Patch}-${IsProduction() ? "production" : "dev"}`;
const BuildStringNoTag = `${Build.Major}.${Build.Minor}.${Build.Patch}`;

module.exports = {
    IsProduction,
    Build,
    BuildString,
    BuildStringNoTag
};