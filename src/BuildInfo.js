const Build = {
    Major: 2,
    Minor: 6,
    Patch: 15
};

function IsProduction() {
    return process.env.NODE_ENV === "production";
}

const BuildString = `${Build.Major}.${Build.Minor}.${Build.Patch}-${IsProduction() ? "production" : "dev"}`;

module.exports = {
    IsProduction,
    Build,
    BuildString
};